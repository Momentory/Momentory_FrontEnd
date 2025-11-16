import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { checkEmail, sendEmail, checkEmailVerified } from "../../api/auth";

export default function CreateAccountPage() {
  const navigate = useNavigate();

  /* ---------------------------- 상태 ---------------------------- */
  const [name, setName] = useState("");
  const [nickname] = useState("");
  const [phone, setPhone] = useState("");

  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");

  const [birthYear, setBirthYear] = useState("2000");
  const [birthMonth, setBirthMonth] = useState("01");
  const [birthDay, setBirthDay] = useState("15");

  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  const [agree, setAgree] = useState(false);

  /* ---------------------- 비밀번호 검증 ---------------------- */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    if (!regex.test(value)) {
      setIsPasswordValid(false);
      setPasswordMessage("8자 이상, 영문과 숫자를 모두 포함해야 합니다.");
    } else {
      setIsPasswordValid(true);
      setPasswordMessage("사용 가능한 비밀번호입니다.");
    }

    if (passwordConfirm) {
      if (value === passwordConfirm) {
        setIsPasswordMatch(true);
        setConfirmMessage("비밀번호가 일치합니다.");
      } else {
        setIsPasswordMatch(false);
        setConfirmMessage("비밀번호가 일치하지 않습니다.");
      }
    }
  };

  const handlePasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordConfirm(value);

    if (password === value) {
      setIsPasswordMatch(true);
      setConfirmMessage("비밀번호가 일치합니다.");
    } else {
      setIsPasswordMatch(false);
      setConfirmMessage("비밀번호가 일치하지 않습니다.");
    }
  };

  /* --------------------------- 이메일 인증 --------------------------- */

  // 인증 메일 발송
  const handleSendEmail = async () => {
    if (!email) return alert("이메일을 입력해주세요.");

    try {
      const checkRes: any = await checkEmail(email);

      if (checkRes?.result === "중복 있음") {
        alert("이미 가입된 이메일입니다.");
        return;
      }

      await sendEmail(email);
      setEmailSent(true);
      alert("인증 메일을 발송했습니다!\n메일함에서 인증 링크를 클릭해주세요.");
    } catch (error) {
      alert("이메일 전송 오류");
      console.error(error);
    }
  };

  // 인증 여부 확인
  const handleCheckVerified = async () => {
    try {
      const res: any = await checkEmailVerified(email);

      if (res?.result === true) {
        setEmailVerified(true);
        alert("이메일 인증이 완료되었습니다!");
      } else {
        alert("아직 인증되지 않았습니다.\n메일의 인증 링크를 클릭해주세요.");
      }
    } catch (error) {
      alert("인증 상태 확인 실패");
      console.error(error);
    }
  };

  /* ----------------------------- 프로필 생성 페이지로 이동 ----------------------------- */
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agree) return alert("약관에 동의해야 합니다.");
    if (!emailVerified) return alert("이메일 인증을 완료해주세요.");
    if (!isPasswordValid) return alert("비밀번호 형식이 잘못되었습니다.");
    if (!isPasswordMatch) return alert("비밀번호가 일치하지 않습니다.");

    const birthDate = `${birthYear}-${birthMonth}-${birthDay}`;

    const allAccountData = {
      name,
      nickname,
      phone,
      email,
      password,
      gender,
      birthDate,
    };

    navigate("/create-profile", { state: allAccountData });
  };

  /* ----------------------------- UI ----------------------------- */
  return (
    <div className="w-[390px] h-[844px] mx-auto bg-white overflow-y-auto flex flex-col">

      {/* ===== 상단 헤더 ===== */}
      <div className="w-full px-[20px] pt-[25px] pb-[10px]">
        <img
          src="/images/109618.png"
          className="w-[28px] h-[28px] cursor-pointer mb-10"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-[24px] font-semibold mb-5">회원가입</h1>
      </div>

      {/* 폼 */}
      <form onSubmit={handleNext} className="flex flex-col w-[332px] mx-auto space-y-4 pb-[40px]">

        {/* 이름 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-[50px] rounded-2xl border px-4"
          />
        </div>

        {/* 전화번호 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">전화번호</label>
          <input
            type="tel"
            placeholder="010-1111-2222"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full h-[50px] rounded-2xl border px-4"
          />
        </div>

        {/* 성별 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">성별</label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setGender("MALE")}
              className={`px-4 py-2 rounded-2xl border ${gender === "MALE" ? "bg-[#FF7070] text-white" : "bg-gray-100"}`}
            >
              남성
            </button>
            <button
              type="button"
              onClick={() => setGender("FEMALE")}
              className={`px-4 py-2 rounded-2xl border ${gender === "FEMALE" ? "bg-[#FF7070] text-white" : "bg-gray-100"}`}
            >
              여성
            </button>
          </div>
        </div>

        {/* 생년월일 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">생년월일</label>
          <div className="flex space-x-2">
            <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)} className="flex-1 border rounded-2xl px-2 py-2 text-sm">
              <option>2000</option>
              <option>2001</option>
              <option>2002</option>
              <option>2003</option>
            </select>

            <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} className="flex-1 border rounded-2xl px-2 py-2 text-sm">
              {[...Array(12)].map((_, i) => (
                <option key={i}>{String(i + 1).padStart(2, "0")}</option>
              ))}
            </select>

            <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)} className="flex-1 border rounded-2xl px-2 py-2 text-sm">
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
              value={email}
              placeholder="abcd@naver.com"
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-[50px] rounded-2xl border px-4"
            />

            {!emailSent ? (
              <button
                type="button"
                onClick={handleSendEmail}
                className="w-[80px] h-[50px] rounded-2xl text-white bg-[#FF7070] text-sm font-semibold flex-shrink-0"
              >
                발송
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCheckVerified}
                className={`w-[80px] h-[50px] rounded-2xl text-white text-sm font-semibold flex-shrink-0 ${
                  emailVerified ? "bg-green-400" : "bg-gray-400"
                }`}
              >
                {emailVerified ? "완료" : "확인"}
              </button>
            )}
          </div>
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full h-[50px] border rounded-2xl px-4"
          />

          {password && (
            <p className={`text-xs mt-1 ${isPasswordValid ? "text-green-500" : "text-red-500"}`}>
              {passwordMessage}
            </p>
          )}

          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={handlePasswordConfirm}
            className="w-full h-[50px] border rounded-2xl px-4 mt-3"
          />

          {passwordConfirm && (
            <p className={`text-xs mt-1 ${isPasswordMatch ? "text-green-500" : "text-red-500"}`}>
              {confirmMessage}
            </p>
          )}
        </div>

        {/* 약관 */}
        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="w-4 h-4 accent-[#FF7070] flex-shrink-0"
          />
          <label className="text-sm">
            약관에 동의합니다{" "}
            <Link to="/terms" className="text-blue-500 underline">
              (약관 보기)
            </Link>
          </label>
        </div>

        {/* 제출 버튼 */}
        <button
          disabled={!agree}
          type="submit"
          className={`w-full h-[60px] rounded-2xl text-white text-lg font-semibold mt-6 ${
            agree ? "bg-[#FF7070]" : "bg-gray-300"
          }`}
        >
          다음
        </button>
      </form>
    </div>
  );
}
