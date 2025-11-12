import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { deleteAccount } from "../../api/mypage";
import { tokenStore } from "../../lib/token";

export default function WithdrawPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleWithdraw = async () => {
        const confirmed = window.confirm(
            "정말 회원탈퇴를 진행하시겠습니까?\n\n" +
            "⚠️ 주의사항:\n" +
            "- 모든 데이터가 영구적으로 삭제됩니다\n" +
            "- 이 작업은 되돌릴 수 없습니다\n" +
            "- 탈퇴 후 같은 계정으로 재가입할 수 없습니다"
        );

        if (!confirmed) return;

        setLoading(true);
        try {
            await deleteAccount();

            // 로컬 스토리지 정리
            tokenStore.clear();
            localStorage.clear();

            alert("회원탈퇴가 완료되었습니다.\n그동안 이용해주셔서 감사합니다.");
            navigate("/login", { replace: true });
        } catch (error: any) {
            console.error("회원탈퇴 실패:", error);
            alert(
                error.response?.data?.message ||
                "회원탈퇴 처리 중 오류가 발생했습니다."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen flex flex-col justify-between overflow-hidden">
            {/* 상단바 */}
            <div className="relative flex items-center justify-center px-5 py-4 bg-white">
                <img
                    src="/images/109618.png"
                    alt="뒤로가기"
                    className="absolute left-[20px] top-[50%] -translate-y-1/2 w-[28px] h-[28px] cursor-pointer"
                    onClick={() => navigate(-1)}
                />
                <h1 className="text-[25px] font-semibold text-gray-800">회원탈퇴</h1>
            </div>

            {/* 본문 */}
            <div className="relative w-full h-[750px] flex flex-col items-center">
                {/* 텍스트 */}
                <div className="absolute top-[80px] left-[42px] text-left z-[50]">
                    <h2 className="text-[29px] font-semibold text-[#3f3f3f] leading-[1.3] whitespace-pre-line">
                        정말 회원탈퇴를{"\n"}진행할까요?
                    </h2>
                    <p className="mt-[6px] text-[13px] text-[#8a8a8a]">
                        이전의 모든 정보는 복원할 수 없어요
                    </p>
                </div>

                <img
                    src="/images/Ellipse.png"
                    alt="배경 원"
                    className="absolute top-[150px] left-[100px] w-[440px] h-[440px] object-contain opacity-80 z-[1]"
                />

                {/* 점선 박스 */}
                <img
                    src="/images/Rectangle.png"
                    alt="점선 박스"
                    className="absolute top-[251px] left-[100px] w-[190px] h-[270px] z-[5]"
                />

                {/* 로더  */}
                <img
                    src="/images/Loader.png"
                    alt="로더"
                    className="absolute top-[340px] left-[85px] w-[146px] h-[146px] opacity-60 rotate-[-12deg] z-[6]"
                />

                {/* 트리 사진 */}
                <img
                    src="/images/tree.png"
                    alt="트리"
                    className="absolute top-[260px] left-[260px] w-[112px] rotate-[12deg] shadow-[0_3px_5px_rgba(0,0,0,0.25)] z-[8]"
                />

                {/* 벚꽃 사진 */}
                <img
                    src="/images/flower.png"
                    alt="벚꽃"
                    className="absolute top-[220px] left-[210px] w-[82px] rotate-[-10deg] shadow-[0_3px_5px_rgba(0,0,0,0.2)] z-[9]"
                />


                {/* 캐릭터 */}
                <img
                    src="/images/exitchar.png"
                    alt="탈퇴 캐릭터"
                    className="absolute top-[440px] left-1/2 -translate-x-1/2 w-[285px] h-[226px] z-[30]"
                />

                {/* 그림자 */}
                <img
                    src="/images/Ellipse2.png"
                    alt="그림자"
                    className="absolute top-[655px] left-1/2 -translate-x-1/2 w-[230px] h-[29px] z-[25]"
                />
            </div>

            {/* 탈퇴 버튼 */}
            <div className="px-6 mb-8">
                <button
                    onClick={handleWithdraw}
                    disabled={loading}
                    className="w-full bg-[#FF7070] text-white text-[22px] font-semibold py-5 rounded-full shadow-md active:scale-[0.98] transition-all duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? "탈퇴 처리 중..." : "탈퇴하기"}
                </button>
            </div>
        </div>
    );
}
