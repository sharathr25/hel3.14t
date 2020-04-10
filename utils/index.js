// @flow
export const regex = {
    email : /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    phoneNo:  /^\d{10}$/
}

export const getPluralStr = (value: number, str: string) =>
Math.floor(value) === 0
  ? ""
  : Math.floor(value) === 1
  ? `${Math.floor(value)} ${str}`
  : `${Math.floor(value)} ${str}s`;

export const getTimeDiffrence = (time: number) => {
  const currentTime = new Date().getTime();
  const inMilliSeconds = currentTime - time;
  const inSeconds = inMilliSeconds / 1000;
  const inMinutes = inSeconds / 60;
  if (inMinutes < 60) {
    return `${getPluralStr(inMinutes, "Minute")} ago`;
  }
  const inHours = inMinutes / 60;
  if (inHours < 24) {
    return `${getPluralStr(inHours, "Hour")} ago`;
  }
  const inDays = inHours / 24;
  if (inDays < 30) {
    return `${getPluralStr(inDays, "Day")} ago`
  }
  return "Long time ago";
};

export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};
  
const deg2rad = deg => deg * (Math.PI / 180);
  
export const getAge = (dob: string) => {
  const birthday = new Date(dob);
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
  
  
export const sortByDistance = (helpRequests: Array<Object>):Array<Object> => {
  const sortedHelpRequests = helpRequests.sort((a,b) => {
    return a.distance > b.distance ? 1 : -1
  })
  return sortedHelpRequests;
}
  