import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white px-6 py-10">
      {/* 🔹 상단 뒤로가기 + 타이틀 */}
      <div className="w-full flex items-center mb-6">
        <Link to="/login" className="text-2xl text-gray-700 font-light mr-2">
          ←
        </Link>
        <h1 className="text-[24px] font-semibold text-black">Create account</h1>
      </div>

      {/* 🔹 입력 폼 */}
      <form className="flex flex-col w-full max-w-[346px] space-y-4">
        {/* 이름 */}
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 rounded-[10px] px-4 py-3 text-[15px] placeholder-gray-400"
        />

        {/* 전화번호 */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone number"
          value={form.phone}
          onChange={handleChange}
          className="border border-gray-300 rounded-[10px] px-4 py-3 text-[15px] placeholder-gray-400"
        />

        {/* 생일 */}
        <div className="flex justify-between space-x-2">
          <select
            name="birthYear"
            value={form.birthYear}
            onChange={handleChange}
            className="border border-gray-300 rounded-[10px] px-3 py-3 w-1/3 text-[15px] text-gray-600"
          >
            <option value="">Year</option>
            {Array.from({ length: 30 }, (_, i) => 2000 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            name="birthMonth"
            value={form.birthMonth}
            onChange={handleChange}
            className="border border-gray-300 rounded-[10px] px-3 py-3 w-1/3 text-[15px] text-gray-600"
          >
            <option value="">Month</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m.toString().padStart(2, "0")}
              </option>
            ))}
          </select>

          <select
            name="birthDay"
            value={form.birthDay}
            onChange={handleChange}
            className="border border-gray-300 rounded-[10px] px-3 py-3 w-1/3 text-[15px] text-gray-600"
          >
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>

        {/* 이메일 */}
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          className="border border-gray-300 rounded-[10px] px-4 py-3 text-[15px] placeholder-gray-400"
        />

        {/* 비밀번호 */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border border-gray-300 rounded-[10px] px-4 py-3 text-[15px] placeholder-gray-400"
        />

        {/* 비밀번호 확인 */}
        <input
          type="password"
          name="confirm"
          placeholder="Confirm Password"
          value={form.confirm}
          onChange={handleChange}
          className="border border-gray-300 rounded-[10px] px-4 py-3 text-[15px] placeholder-gray-400"
        />
      </form>

      {/* 🔹 약관 및 버튼 */}
      <div className="w-full max-w-[346px] mt-6 text-right text-[13px] text-blue-600 cursor-pointer">
        Terms of Service →
      </div>

      <button
        type="submit"
        className="w-[346px] h-[70px] bg-[#FF7070] text-white text-[18px] font-semibold rounded-[25px] mt-6 active:scale-95 transition"
      >
        Next
      </button>
    </div>
  );
}
