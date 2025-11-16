import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { checkEmail, sendEmail, checkEmailVerified, signup } from "../../api/auth";

export default function CreateAccountPage() {
  const navigate = useNavigate();

  /* ---------------------------- 상태 ---------------------------- */
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
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

  //  인증 메일 발송
  const handleSendEmail = async () => {
    if (!email) return alert("이메일을 입력해주세요.");

    try {
      const checkRes: any = await checkEmail(email);

      if (checkRes?.result === "중복 있음" || checkRes?.result === "중복임") {
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

  /* ----------------------------- 회원가입 요청 ----------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agree) return alert("약관에 동의해야 합니다.");
    if (!emailVerified) return alert("이메일 인증을 완료해주세요.");
    if (!isPasswordValid) return alert("비밀번호 형식이 잘못되었습니다.");
    if (!isPasswordMatch) return alert("비밀번호가 일치하지 않습니다.");
    if (!nickname.trim()) return alert("닉네임을 입력해주세요.");

    const birthDate = `${birthYear}-${birthMonth}-${birthDay}`;

    try {
      await signup({
        email,
        password,
        nickName:nickname,     
        name,
        phone,
        gender,
        birthDate,
        agreeTerms: true,
        imageUrl: "",
        imageName: "",
        bio: "",
        externalLink: "",
        characterType: "CAT"
      });

      alert("회원가입이 완료되었습니다!");
      navigate("/create-profile");
    } catch (err) {
      console.error("회원가입 오류:", err);
      alert("회원가입 실패");
    }
  };

  /* ----------------------------- UI ----------------------------- */
  return (
    <div className="flex flex-col items-center min-h-screen bg-white px-[28px] pt-[120px]">
      {/* 헤더 */}
      <div className="relative w-full mb-8">
        <img
          src="/images/109618.png"
          className="absolute top-[-80px] left-[15px] w-[35px] h-[35px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-[24px] font-semibold ml-5">회원가입</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col w-[332px] space-y-4">
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

        {/* 닉네임 */}
        <div>
          <label className="text-[15px] font-semibold mb-1 block">닉네임</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
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
              className={`px-4 py-2 rounded-2xl border ${
                gender === "MALE" ? "bg-[#FF7070] text-white" : "bg-gray-100"
              }`}
            >
              남성
            </button>
            <button
              type="button"
              onClick={() => setGender("FEMALE")}
              className={`px-4 py-2 rounded-2xl border ${
                gender === "FEMALE" ? "bg-[#FF7070] text-white" : "bg-gray-100"
              }`}
            >
              여성
            </button>
          </div>
        </div>

        {/* 생년월일 */}
        <div>
          <label className="text-[17px] font-semibold mb-1 block">생년월일</label>
          <div className="flex space-x-5">
            <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)} className="border rounded-2xl px-6 py-2">
              <option>2000</option>
              <option>2001</option>
              <option>2002</option>
              <option>2003</option>
            </select>

            <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} className="border rounded-2xl px-6 py-2">
              {[...Array(12)].map((_, i) => (
                <option key={i}>{String(i + 1).padStart(2, "0")}</option>
              ))}
            </select>

            <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)} className="border rounded-2xl px-6 py-2">
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
                className="w-[90px] h-[50px] rounded-2xl text-white bg-[#FF7070]"
              >
                발송
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCheckVerified}
                className={`w-[90px] h-[50px] rounded-2xl text-white ${
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
            <p className={`text-sm mt-1 ${isPasswordValid ? "text-green-500" : "text-red-500"}`}>
              {passwordMessage}
            </p>
          )}

          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={handlePasswordConfirm}
            className="w-full h-[50px] border rounded-2xl px-4 mt-2"
          />

          {passwordConfirm && (
            <p className={`text-sm mt-1 ${isPasswordMatch ? "text-green-500" : "text-red-500"}`}>
              {confirmMessage}
            </p>
          )}
        </div>

        {/* 약관 */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="w-4 h-4 accent-[#FF7070]"
          />
          <label className="text-sm">
            약관에 동의합니다{" "}
            <Link to="/terms" className="text-blue-500 underline">
              (약관 보기)
            </Link>
          </label>
        </div>

        {/* 제출 */}
        <button
          disabled={!agree}
          type="submit"
          className={`w-full h-[60px] rounded-2xl text-white text-lg font-semibold mt-4 ${
            agree ? "bg-[#FF7070]" : "bg-gray-300"
          }`}
        >
          다음
        </button>
      </form>
    </div>
  );
}
