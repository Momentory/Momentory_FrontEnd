import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, ArrowLeft } from "lucide-react";
import { postCommunity } from "../../api/community";

// 경기도 31개 시·군 + 기타
const GYEONGGI_REGIONS = [
  "수원시", "성남시", "고양시", "용인시", "부천시", "안산시", "안양시",
  "남양주시", "화성시", "평택시", "의정부시", "시흥시", "파주시",
  "김포시", "광명시", "광주시", "군포시", "이천시", "양주시", "오산시",
  "구리시", "안성시", "포천시", "의왕시", "하남시", "여주시",
  "양평군", "동두천시", "과천시", "가평군", "연천군", "기타"
];

export default function CommunityWritePage() {
  const navigate = useNavigate();

  // 입력 상태 관리
  const [region, setRegion] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile] = useState<File | null>(null);

  // 이미지 업로드
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  // 게시 버튼 함수 교체
  const handleSubmit = async () => {
    if (!region || !title.trim() || !content.trim()) return;

    // FormData 생성 (파일 포함)
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("region", region);

    // 태그는 공백 기준으로 나눠서 여러 개 추가
    tags.split(" ").forEach((tag) => formData.append("tags", tag));

    if (preview) console.log("이미지 미리보기 있음");
    if (imageFile) formData.append("image", imageFile); // 파일 객체 추가

    console.log("업로드 데이터:", [...formData.entries()]);

    try {
      const res = await postCommunity(formData); // 서버로 업로드 요청
      console.log("업로드 성공:", res);

      alert("게시글이 등록되었습니다!");
      // 업로드한 새 글을 state로 함께 전달
      navigate("/community", {
        replace: true,
        state: {
          newPost: {
            title,
            content,
            tags: tags.split(" "),
            image: preview,
            createdAt: new Date().toISOString(), 
          },
        },
      });
    } catch (err) {
      console.error("업로드 실패:", err);
      alert("업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col relative">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between bg-[#FF7070] text-white px-5 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </button>
        </div>
        <button
          onClick={handleSubmit}
          className="text-white text-[18px] font-semibold hover:opacity-80 transition"
        >
          게시
        </button>
      </header>

      {/* 글쓰기 제목 영역 */}
      <div className="flex items-center justify-between bg-white px-5 py-6 border-b border-gray-200">
        <h1 className="text-[25px] font-semibold text-gray-800">글쓰기</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/community/write")}
            className="hover:opacity-80 transition"
          >
            <img src="/images/Edit.png" alt="글쓰기" className="w-[22px] h-[22px]" />
          </button>

          <button
            onClick={() => navigate("/community/mypage")}
            className="hover:opacity-80 transition"
          >
            <img src="/images/User.png" alt="내활동" className="w-[22px] h-[22px]" />
          </button>
        </div>
      </div>

      {/* 이미지 업로드 영역 */}
      <div className="relative bg-white px-5 py-4 border-b border-gray-200">
        <div className="relative flex items-center justify-center px-5 py-4 bg-white border-gray-200 mb-2">
          <img
            src="/images/109618.png"
            alt="뒤로가기"
            className="absolute left-[2px] top-[50%] -translate-y-1/2 w-[30px] h-[30px] cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <button
            onClick={handleSubmit}
            className="absolute right-[20px] top-[50%] -translate-y-1/2 text-[#599EFF] text-[18px] font-semibold hover:opacity-80 transition"
          >
            게시
          </button>
        </div>

        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="w-full h-[370px] object-cover rounded-xl border mt-3"
          />
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-[180px] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition">
            <ImagePlus size={30} className="text-gray-400 mb-1" />
            <span className="text-gray-500 text-[14px] font-medium">
              사진 업로드
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* 입력 폼 */}
      <div className="flex-1 bg-white px-5 py-5 space-y-5">
        {/* 지역 선택 */}
        <div>
          <label className="block text-[22px] font-semibold text-gray-800 mb-2">
            지역 선택
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#CECECE] transition bg-white"
          >
            <option value="">지역을 선택해주세요</option>
            {GYEONGGI_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* 제목 */}
        <div>
          <label className="block text-[22px] font-semibold text-gray-800 mb-2">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#CECECE] transition"
          />
        </div>

        {/* 본문 */}
        <div>
          <label className="block text-[22px] font-semibold text-gray-800 mb-2">
            본문
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="본문을 입력해주세요..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[13px] h-[130px] resize-none outline-none focus:border-[#CECECE] transition"
          />
        </div>

        {/* 태그 */}
        <div>
          <label className="block text-[22px] font-semibold text-gray-800 mb-2">
            태그
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="# 태그 입력 (예: #고양시 #스타필드)"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-[#CECECE] transition"
          />
        </div>
      </div>
      <div className="h-[90px]" />

    </div>
  );
}
