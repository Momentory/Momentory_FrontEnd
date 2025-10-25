import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  checkEmail,
  sendEmail,
  checkEmailVerified,
  signup,
} from "../../api/auth";

export default function CreateAccountPage() {
  const navigate = useNavigate();

  // 상태 관리
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthYear, setBirthYear] = useState("2000");
  const [birthMonth, setBirthMonth] = useState("01");
  const [birthDay, setBirthDay] = useState("15");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agree, setAgree] = useState(false);

  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // 이메일 인증 요청
  const handleEmailClick = async () => {
    try {
      await checkEmail(email);
      await sendEmail(email);
      setEmailSent(true);
      alert("인증 메일이 발송되었습니다. 메일함을 확인해주세요.");
    } catch {
      alert("이미 존재하는 이메일이거나 발송 중 오류가 발생했습니다.");
    }
  };

  // 이메일 인증 확인
  const handleVerifyClick = async () => {
    try {
      const { data } = await checkEmailVerified(email);
      if (data.verified) {
        setEmailVerified(true);
        alert("이메일 인증이 완료되었습니다.");
      } else {
        alert("이메일 인증이 아직 완료되지 않았습니다.");
      }
    } catch {
      alert("이메일 인증 확인 중 오류가 발생했습니다.");
    }
  };

  // 회원가입 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agree) return alert("약관에 동의해야 가입할 수 있습니다.");
    if (password !== passwordConfirm)
      return alert("비밀번호가 일치하지 않습니다.");
    if (!emailVerified) return alert("이메일 인증을 완료해주세요.");

    try {
      await signup({
        email,
        password,
        nickname: name,
        name,
        phone,
        birth: `${birthYear}-${birthMonth}-${birthDay}`,
      });
      alert("회원가입이 완료되었습니다!");
      navigate("/account-created");
    } catch {
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white px-[28px] pt-[120px]">
      {/* 뒤로가기 */}
      <div className="relative w-full mb-8">
        <img
          src="/images/109618.png"
          alt="뒤로가기"
          className="absolute top-[-80px] left-[2px] w-[35px] h-[35px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-[24px] font-semibold text-black mb-2">
          회원가입
        </h1>
      </div>

      {/* 폼 */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[332px] space-y-4"
      >
        {/* 이름 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">이름</label>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-[50px] rounded-[10px] border border-gray-300 px-4 text-[15px] placeholder-gray-400"
          />
        </div>

        {/* 전화번호 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">
            전화 번호
          </label>
          <input
            type="tel"
            placeholder="010-1111-2222"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full h-[50px] rounded-[10px] border border-gray-300 px-4 text-[15px] placeholder-gray-400"
          />
        </div>

        {/* 생년월일 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">
            생년월일
          </label>
          <div className="flex space-x-2">
            <select
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              className="w-[100px] h-[50px] rounded-[10px] border border-gray-300 px-2 text-[15px]"
            >
              <option>2000</option>
              <option>2001</option>
              <option>2002</option>
              <option>2003</option>
            </select>
            <select
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
              className="w-[100px] h-[50px] rounded-[10px] border border-gray-300 px-2 text-[15px]"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i}>{String(i + 1).padStart(2, "0")}</option>
              ))}
            </select>
            <select
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              className="w-[100px] h-[50px] rounded-[10px] border border-gray-300 px-2 text-[15px]"
            >
              {[...Array(31)].map((_, i) => (
                <option key={i}>{String(i + 1).padStart(2, "0")}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 이메일 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">이메일</label>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="abc@naver.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-[50px] rounded-[10px] border border-gray-300 px-4 text-[15px] placeholder-gray-400"
            />
            <button
              type="button"
              onClick={emailSent ? handleVerifyClick : handleEmailClick}
              className={`w-[90px] h-[50px] rounded-[10px] text-white text-[14px] font-medium ${
                emailVerified
                  ? "bg-green-400"
                  : emailSent
                  ? "bg-gray-400"
                  : "bg-[#FF7070]"
              }`}
            >
              {emailVerified ? "완료" : emailSent ? "인증" : "링크발송"}
            </button>
          </div>
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">
            비밀번호
          </label>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[50px] rounded-[10px] border border-gray-300 px-4 text-[15px] placeholder-gray-400 mb-2"
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
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
          <label htmlFor="agree" className="text-[14px] text-gray-600">
            약관에 동의하고 가입{" "}
            <Link to="/terms" className="text-blue-600 hover:underline">
              서비스 약관
            </Link>
          </label>
        </div>

        {/* 다음 버튼 */}
        <button
          disabled={!agree}
          type="submit"
          className={`w-[332px] h-[70px] text-white text-[18px] font-semibold rounded-[25px] mt-8 transition active:scale-95 ${
            agree ? "bg-[#FF7070]" : "bg-gray-300"
          }`}
        >
          다음
        </button>
      </form>
    </div>
  );
}
