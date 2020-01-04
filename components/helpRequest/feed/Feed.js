import React, { useState, useEffect, useReducer } from "react";
import { firebaseOnEventListner, firebaseOnEventListnerTurnOff, getFeed } from "../../../fireBase/database";

const FIREBASE_FETCH_LIMIT = 5;
const HELPREQUEST_FEED_LIMIT = 50;
const HELPREQUEST_FEED_REMOVE_LIMIT = 5;

const feedReducer = (state, action) => {
  const { feedItems, referenceToOldestKey } = state;
  const { type, payload } = action;
  const { newFeedItems, newReferenceToOldestKey } = payload;
  switch (type) {
    case 'ADD': {
      return ({
        feedItems: newFeedItems,
        referenceToOldestKey: newReferenceToOldestKey
      });
    }
    case 'ROMOVE': {
      const newFeedItems = feedItems.filter((feedItem) => {
        return feedItem.key !== payload.key
      });

      if (newFeedItems.length === 0) {
        return { feedItems: newFeedItems, referenceToOldestKey: '' }
      }
      return { feedItems: newFeedItems, referenceToOldestKey }
    }
    default: return state;
  }
}

const Feed = (props) => {
  const [{ feedItems, referenceToOldestKey }, dispatch] = useReducer(feedReducer, { feedItems: [], referenceToOldestKey: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [lastKey, setLastKey] = useState('');

  removeFromFeedItems = (data) => {
    dispatch({type:"ROMOVE",payload:data})
  }

  getFeedItems = async () => {
    const { db } = props;
    const data = await getFeed(db, true, null, 1);
    if (data.val() === null) return;
    if (lastKey !== Object.keys(data.val())[0]) {
      setLastKey(Object.keys(data.val())[0]);
    }
    if (lastKey !== "" && referenceToOldestKey !== "" && referenceToOldestKey === lastKey) {
      return;//return if we are last key in firebase
    }
    setIsLoading(true);
    try {
      const data = referenceToOldestKey === "" ? await getFeed(db, true, null, FIREBASE_FETCH_LIMIT) : await getFeed(db, false, referenceToOldestKey, FIREBASE_FETCH_LIMIT);
      if (data.val() === null) {
        setIsLoading(false);
        return;
      }
      const keys = referenceToOldestKey === "" ? Object.keys(data.val()).sort().reverse() : Object.keys(data.val()).sort().slice(1).reverse();
      const results = keys.map((key) => ({ ...data.val()[key], key }));
      tempFeedItems = feedItems.length >= HELPREQUEST_FEED_LIMIT ? feedItems.splice(-HELPREQUEST_FEED_REMOVE_LIMIT) : feedItems;
      setIsLoading(false);
      dispatch({ type: 'ADD', payload: { newFeedItems: [...results, ...tempFeedItems], newReferenceToOldestKey: keys[0] } });
    } catch (err) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getFeedItems();
    const { db } = props;
    firebaseOnEventListner(`/${db}`, 'child_removed', removeFromFeedItems);
    return (() => {
      firebaseOnEventListnerTurnOff(`/${db}`);
    });
  }, []);

  const { FeedWrapper, FeedItem } = props;
  return <FeedWrapper isLoading={isLoading} feedItems={feedItems} ChildComponent={FeedItem} getFeedItems={getFeedItems} />;

}

export default Feed;
