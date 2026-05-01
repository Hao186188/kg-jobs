// utils/distance.js
// Tính khoảng cách giữa 2 điểm (lat, lng) - Công thức Haversine
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Hàm logic đặc thù: đánh dấu việc làm gần bạn
function markJobNearStudent(job, studentLat, studentLng, thresholdKm = 5) {
  if (!job.location || job.location.lat === undefined) return { ...job, isNear: false };
  
  const distance = getDistanceFromLatLonInKm(
    studentLat, studentLng, 
    job.location.lat, job.location.lng
  );
  
  return {
    ...job.toObject ? job.toObject() : job,
    isNear: distance <= thresholdKm,
    distanceKm: distance.toFixed(2)
  };
}

module.exports = { getDistanceFromLatLonInKm, markJobNearStudent };