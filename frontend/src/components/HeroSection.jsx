// components/HeroSection.jsx
import React, { useState } from 'react';

const HeroSection = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(keyword);
  };
  
  return (
    <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-20 px-4 rounded-b-3xl shadow-lg">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          🇻🇳 KG-Jobs – Việc làm cho sinh viên <br className="hidden sm:block" />
          Cao đẳng Nghề Kiên Giang
        </h1>
        <p className="text-lg md:text-xl opacity-90 mb-8">
          Kết nối việc làm bán thời gian, thực tập ngay gần trường – Vừa học vừa làm, vững tương lai!
        </p>
        
        {/* Thanh tìm kiếm nhanh */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Tìm việc theo tên, chuyên ngành (IT, Điện, Cơ khí...)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 px-5 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-full transition shadow-md"
          >
            🔍 Tìm việc ngay
          </button>
        </form>
        
        <p className="text-sm opacity-75 mt-4">
          🔥 Hàng trăm việc làm bán thời gian gần trường, phù hợp với sinh viên năm 1 đến năm 3
        </p>
      </div>
    </div>
  );
};

export default HeroSection;