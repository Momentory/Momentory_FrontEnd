import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  checkEmail,
  sendEmail,
  checkEmailVerified,
  signup,
} from "../api/auth";

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const handleEmailSend = async () => {
    try {
      await checkEmail(email);
      await sendEmail(email);
      alert("인증 메일을 보냈습니다! 📧");
      setEmailSent(true);
    } catch {
      alert("이미 존재하는 이메일입니다 ❌");
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const res = await checkEmailVerified(email);
      if (res.data.verified) {
        setEmailVerified(true);
        alert("이메일 인증 완료 ✅");
      } else {
        alert("이메일 인증이 아직 완료되지 않았습니다 ❌");
      }
    } catch {
      alert("이메일 인증 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSignup = async () => {
    if (!emailVerified) {
      alert("이메일 인증을 완료해주세요 ❗");
      return;
    }
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다 ❌");
      return;
    }
    try {
      await signup({
        email,
        password,
        nickname: "MomentoryUser", // 추후 닉네임 입력 추가 시 교체 가능
      });
      alert("회원가입 성공 🎉");
      navigate("/account-created");
    } catch {
      alert("회원가입 실패 ❌");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white px-[28px] pt-[120px]">
      {/*  뒤로가기 */}
      <div className="relative w-full mb-8">
        <img
          src="/images/109618.png"
          alt="뒤로가기"
          className="absolute top-[-80px] left-[2px] w-[35px] h-[35px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-[24px] font-semibold text-black mb-2">회원 가입</h1>
      </div>

      <form className="flex flex-col w-[332px] space-y-4">
        {/* 이메일 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">이메일</label>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-[50px] rounded-[10px] border border-gray-300 px-4 text-[15px] placeholder-gray-400"
            />
            <button
              type="button"
              onClick={handleEmailSend}
              disabled={!email}
              className={`w-[90px] h-[50px] rounded-[10px] text-white text-[14px] font-medium ${
                emailSent ? "bg-gray-400" : "bg-[#FF7070]"
              }`}
            >
              {emailSent ? "발송됨" : "링크발송"}
            </button>
          </div>

          {/* 인증 확인 버튼 */}
          {emailSent && (
            <button
              type="button"
              onClick={handleVerifyEmail}
              className="mt-2 text-[14px] text-blue-500 underline"
            >
              인증 완료 확인
            </button>
          )}
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">비밀번호</label>
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
          <label htmlFor="agree" className="text-[14px] text-gray-600 cursor-pointer">
            약관 동의하고 가입하기{" "}
            <Link to="/terms" className="text-blue-600 hover:underline">
              서비스 약관
            </Link>
          </label>
        </div>
      </form>

      {/* 회원가입 버튼 */}
      <button
        disabled={!agree}
        onClick={handleSignup}
        className={`w-[332px] h-[70px] text-white text-[18px] font-semibold rounded-[25px] mt-8 transition active:scale-95 ${
          agree ? "bg-[#FF7070]" : "bg-gray-300"
        }`}
      >
        가입하기
      </button>
    </div>
  );
}
