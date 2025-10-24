import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleEmailClick = () => {
    // 실제로는 API 요청 들어갈 자리
    setEmailSent(true);
  };

  return (
    <div className="flex flex-col items-start justify-start min-h-screen bg-white px-[28px] pt-[120px]">
      {/* 🔹 상단 화살표 + 타이틀 */}
      <div className="relative w-full mb-8">
        <img
          src="/images/109618.png"
          alt="뒤로가기"
          className="absolute top-[-80px] left-[2px] w-[35px] h-[35px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-[24px] font-semibold text-black mb-2">
          Create account
        </h1>
      </div>

      {/* 🔹 입력 폼 */}
      <form className="flex flex-col w-[332px] space-y-4">
        {/* 이름 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">Name</label>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full h-[50px] rounded-[10px] border border-gray-300 px-4 text-[15px] placeholder-gray-400"
          />
        </div>

        {/* 전화번호 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">
            Phone number
          </label>
          <input
            type="tel"
            placeholder="Phone number"
            className="w-full h-[50px] rounded-[10px] border border-gray-300 px-4 text-[15px] placeholder-gray-400"
          />
        </div>

        {/* 생일 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">
            Birthday
          </label>
          <div className="flex space-x-2">
            <select className="w-[100px] h-[50px] rounded-[10px] border border-gray-300 px-2 text-[15px] text-gray-600">
              <option>2000</option>
            </select>
            <select className="w-[100px] h-[50px] rounded-[10px] border border-gray-300 px-2 text-[15px] text-gray-600">
              <option>01</option>
            </select>
            <select className="w-[100px] h-[50px] rounded-[10px] border border-gray-300 px-2 text-[15px] text-gray-600">
              <option>15</option>
            </select>
          </div>
        </div>

        {/* 이메일 + 인증 버튼 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">Email</label>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Your Email"
              className="flex-1 h-[50px] rounded-[10px] border border-gray-300 px-4 text-[15px] placeholder-gray-400"
            />
            <button
              type="button"
              onClick={handleEmailClick}
              className={`w-[90px] h-[50px] rounded-[10px] text-white text-[14px] font-medium ${
                emailSent ? "bg-gray-400" : "bg-[#FF7070]"
              }`}
            >
              {emailSent ? "인증" : "링크발송"}
            </button>
          </div>
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            className="w-full h-[50px] rounded-[10px] border border-gray-300 px-4 text-[15px] placeholder-gray-400 mb-2"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full h-[50px] rounded-[10px] border border-gray-300 px-4 text-[15px] placeholder-gray-400"
          />
        </div>

        {/* 약관 동의 */}
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            id="agree"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="w-[18px] h-[18px] accent-[#FF7070]"
          />
          <label
            htmlFor="agree"
            className="text-[14px] text-gray-600 cursor-pointer"
          >
            I agree to the{" "}
            <span className="text-blue-600 hover:underline">
              Terms of Service
            </span>
          </label>
        </div>
      </form>

      {/* 🔹 Next 버튼 */}
      <button
        disabled={!agree}
        className={`w-[332px] h-[70px] text-white text-[18px] font-semibold rounded-[25px] mt-8 transition active:scale-95 ${
          agree ? "bg-[#FF7070]" : "bg-gray-300"
        }`}
      >
        Next
      </button>
    </div>
  );
}
