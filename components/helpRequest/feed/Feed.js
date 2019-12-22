import React, { useState, useEffect } from "react";
import { firebaseOnEventListner, firebaseOnEventListnerTurnOff, getFeed } from "../../../fireBase/database";

const FIREBASE_FETCH_LIMIT = 5;
const HELPREQUEST_FEED_LIMIT = 50;
const HELPREQUEST_FEED_REMOVE_LIMIT = 5;

const Feed = (props) => {
  const [feedItems, setFeedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [referenceToOldestKey,setReferenceToOldestKey] = useState('');
  const [lastKey,setLastKey] = useState('');

  removeFromFeedItems = (data) => {
      const newFeedItems = feedItems.filter((feedItem)=>{
        return feedItem.key !== data.key
      });
      setFeedItems(newFeedItems);
      if(newFeedItems.length === 0){
        setReferenceToOldestKey('');
    }
  }

  getFeedItems = async () => {
    const { db } = props;
    const data = await getFeed(db, true, null, 1);
    if(data.val()===null)return;
    if(lastKey !== Object.keys(data.val())[0]){
      setLastKey(Object.keys(data.val())[0]);
    }
    if(lastKey !== "" && referenceToOldestKey !== "" && referenceToOldestKey === lastKey){
      return;//return if we are last key in firebase
    }
    setIsLoading(true);
    try {
      const data = referenceToOldestKey === "" ? await getFeed(db, true, null, FIREBASE_FETCH_LIMIT) : await getFeed(db, false, referenceToOldestKey, FIREBASE_FETCH_LIMIT);
      if(data.val()===null){
        setIsLoading(false);
        return;
      }
      const keys = referenceToOldestKey === "" ? Object.keys(data.val()).sort().reverse() : Object.keys(data.val()).sort().slice(1).reverse();
      const results = keys.map((key) => ({...data.val()[key],key}));
      tempFeedItems = feedItems.length >= HELPREQUEST_FEED_LIMIT ? feedItems.splice(-HELPREQUEST_FEED_REMOVE_LIMIT) : feedItems;
      setFeedItems([...results,...tempFeedItems]);
      setReferenceToOldestKey(keys[0]);
      setIsLoading(false);
    } catch(err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getFeedItems();
    const {db} = props;
    firebaseOnEventListner(`/${db}`,'child_removed', removeFromFeedItems);
    return(() => {
      firebaseOnEventListnerTurnOff(`/${db}`);
    });
  }, []);

  const {FeedWrapper, FeedItem} = props;
  return <FeedWrapper isLoading={isLoading} feedItems={feedItems} ChildComponent={FeedItem} getFeedItems={getFeedItems}/>;

}

export default Feed;
