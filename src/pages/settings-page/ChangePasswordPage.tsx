import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Check, Mail } from "lucide-react";
import { changePassword, sendEmail, verifyEmail } from "../../api/auth";
import { getMyProfile } from "../../api/mypage";

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);

    // 사용자 이메일 가져오기
    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const profile = await getMyProfile();
                setEmail(profile.email);
            } catch (error) {
                console.error("이메일 조회 실패:", error);
            }
        };
        fetchEmail();
    }, []);

    // 이메일 인증 링크 발송
    const handleEmailSend = async () => {
        if (!email) {
            alert("이메일 정보를 가져올 수 없습니다.");
            return;
        }

        try {
            await sendEmail(email);
            setEmailSent(true);
            alert("인증 메일이 발송되었습니다. 메일함을 확인해주세요.");
        } catch (error: any) {
            console.error("이메일 발송 실패:", error);
            alert(
                error.response?.data?.message ||
                "이메일 발송 중 오류가 발생했습니다."
            );
        }
    };

    // 이메일 인증 확인
    const handleEmailVerify = async () => {
        const token = prompt("이메일로 받은 인증 링크의 토큰을 입력해주세요:");
        if (!token) return;

        try {
            await verifyEmail(token);
            setEmailVerified(true);
            alert("이메일 인증이 완료되었습니다!");
        } catch (error) {
            console.error("이메일 인증 확인 오류:", error);
            alert("이메일 인증 확인 중 오류가 발생했습니다.");
        }
    };

    const handleSave = async () => {
        // 유효성 검증
        if (!emailVerified) {
            alert("이메일 인증을 완료해주세요.");
            return;
        }

        if (!newPassword || !confirmPassword) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (newPassword.length < 8) {
            alert("비밀번호는 8자 이상이어야 합니다.");
            return;
        }

        setLoading(true);
        try {
            // 비밀번호 변경
            await changePassword({
                email: email,
                newPassword: newPassword,
            });

            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                navigate("/settings");
            }, 2000);
        } catch (error: any) {
            console.error("비밀번호 변경 실패:", error);
            alert(
                error.response?.data?.message ||
                "비밀번호 변경에 실패했습니다."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen flex flex-col justify-between relative">
            {/* 상단바 */}
            <div>
                <div className="relative flex items-center justify-center px-5 py-4 bg-white">
                    <img
                        src="/images/109618.png"
                        alt="뒤로가기"
                        className="absolute left-[20px] top-[50%] -translate-y-1/2 w-[30px] h-[30px] cursor-pointer"
                        onClick={() => navigate(-1)}
                    />
                    <h1 className="text-[25px] font-semibold text-gray-800">
                        비밀번호 변경
                    </h1>
                </div>

                {/* 입력 폼 */}
                <div className="px-6 mt-15">
                    {/* 이메일 인증 */}
                    <div className="mb-6">
                        <label className="block text-[19px] font-semibold text-black-700 mb-2">
                            이메일 인증
                        </label>
                        <div className="flex space-x-2 mb-2">
                            <div className="relative flex-1">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full pl-10 pr-4 py-5 rounded-xl border border-gray-300 text-[15px] bg-gray-50"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={emailSent ? handleEmailVerify : handleEmailSend}
                                disabled={emailVerified}
                                className={`px-6 py-5 rounded-xl text-white text-[14px] font-medium whitespace-nowrap ${
                                    emailVerified
                                        ? "bg-green-400"
                                        : emailSent
                                        ? "bg-gray-400"
                                        : "bg-[#FF7070]"
                                } disabled:cursor-not-allowed`}
                            >
                                {emailVerified ? "완료" : emailSent ? "인증" : "전송"}
                            </button>
                        </div>
                        {emailSent && !emailVerified && (
                            <p className="text-[13px] text-gray-500">
                                이메일로 받은 인증 링크를 확인하고 '인증' 버튼을 클릭하세요.
                            </p>
                        )}
                    </div>

                    {/* 새로운 비밀번호 */}
                    <div className="mb-6">
                        <label className="block text-[19px] font-semibold text-black-700 mb-2">
                            새로운 비밀번호
                        </label>
                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="password"
                                placeholder="비밀번호 (8자 이상)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={loading || !emailVerified}
                                className="w-full pl-10 pr-4 py-5 rounded-xl border border-gray-300 placeholder-gray-400 text-[15px] focus:outline-none focus:ring-1 focus:ring-[#FF7070] disabled:bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* 비밀번호 재확인 */}
                    <div className="mb-10">
                        <label className="block text-[19px] font-semibold text-black-700 mb-2">
                            비밀번호 재확인
                        </label>
                        <div className="relative">
                            <Check
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="password"
                                placeholder="비밀번호 재확인"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading || !emailVerified}
                                className="w-full pl-10 pr-4 py-5 rounded-xl border border-gray-300 placeholder-gray-400 text-[15px] focus:outline-none focus:ring-1 focus:ring-[#FF7070] disabled:bg-gray-100"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 저장 버튼 */}
            <div className="px-6 mb-8">
                <button
                    onClick={handleSave}
                    disabled={loading || !emailVerified}
                    className="w-full bg-[#FF7070] text-white text-[22px] font-semibold py-4 rounded-full active:scale-[0.98] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? "변경 중..." : "저장하기"}
                </button>
            </div>

            {/* 하단 토스트 */}
            {showToast && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-[#3D3D3D] text-white text-[14px] px-5 py-3 rounded-full shadow-lg flex justify-center items-center animate-fadeIn">
                    <span className="font-medium text-center">
                        비밀번호 변경이 완료되었어요
                    </span>
                </div>
            )}
        </div>
    );
}
