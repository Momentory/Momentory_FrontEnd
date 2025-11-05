import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Check } from "lucide-react";

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            navigate("/settings");
        }, 2000); // 2초 뒤에 설정페이지로 이동
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
                                placeholder="비밀번호"
                                className="w-full pl-10 pr-4 py-5 rounded-xl border border-gray-300 placeholder-gray-400 text-[15px] focus:outline-none focus:ring-1 focus:ring-[#FF7070]"
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
                                className="w-full pl-10 pr-4 py-5 rounded-xl border border-gray-300 placeholder-gray-400 text-[15px] focus:outline-none focus:ring-1 focus:ring-[#FF7070]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 저장 버튼 */}
            <div className="px-6 mb-8">
                <button
                    onClick={handleSave}
                    className="w-full bg-[#FF7070] text-white text-[22px] font-semibold py-4 rounded-full active:scale-[0.98] transition"
                >
                    저장하기
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
