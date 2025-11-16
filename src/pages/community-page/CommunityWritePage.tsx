// src/pages/community-page/CommunityWritePage.tsx

import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import {
  postCommunity,
  updatePost,
  getCommunityPostDetail,
} from "../../api/community";
import { uploadFile } from "../../api/S3";

// ------------------ 경기도 지역 ------------------
const GYEONGGI_REGIONS = [
  "수원시",
  "용인시",
  "부천시",
  "광명시",
  "의정부시",
  "고양시",
  "남양주시",
  "화성시",
  "안양시",
  "평택시",
  "시흥시",
  "김포시",
  "안산시",
  "광주시",
  "군포시",
  "이천시",
  "오산시",
  "하남시",
  "파주시",
  "의왕시",
  "양주시",
  "구리시",
  "안성시",
  "포천시",
  "여주시",
  "양평군",
  "가평군",
  "연천군",
  "성남시",
  "동두천시",
  "과천시",
  "기타"
];

const REGION_MAP: Record<string, number> = {
  수원시: 1,
  용인시: 2,
  부천시: 3,
  광명시: 4,
  의정부시: 5,
  고양시: 6,
  남양주시: 7,
  화성시: 8,
  안양시: 9,
  평택시: 10,
  시흥시: 11,
  김포시: 12,
  안산시: 13,
  광주시: 14,
  군포시: 15,
  이천시: 16,
  오산시: 17,
  하남시: 18,
  파주시: 19,
  의왕시: 20,
  양주시: 21,
  구리시: 22,
  안성시: 23,
  포천시: 24,
  여주시: 25,
  양평군: 26,
  가평군: 27,
  연천군: 28,
  성남시: 29,
  동두천시: 30,
  과천시: 31,
  기타: 99,
};

export default function CommunityWritePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { postId } = useParams<{ postId: string }>();

  // location.state 로 넘어온 수정 정보 (있으면 사용)
  const stateIsEdit = location.state?.isEdit ?? false;
  const statePost = location.state?.post ?? null;

  // URL 파라미터가 있거나 state.isEdit 가 true 면 수정 모드
  const isEdit = stateIsEdit || Boolean(postId);

  // 실제 수정 대상 게시글
  const [editPost, setEditPost] = useState<any | null>(statePost);

  const [loading, setLoading] = useState<boolean>(isEdit && !statePost);

  // 폼 상태
  const [region, setRegion] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string>("");

  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  /* -------------------- 수정 모드일 때 게시글 불러오기 -------------------- */
  useEffect(() => {
    // 이미 state로 post를 받았으면 추가 호출 X
    if (!isEdit || editPost || !postId) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await getCommunityPostDetail(Number(postId));
        const data = res.data?.result;
        if (!data) {
          alert("게시글 정보를 불러오지 못했습니다.");
          navigate(-1);
          return;
        }
        setEditPost(data);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
        alert("게시글 정보를 불러오지 못했습니다.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [isEdit, editPost, postId, navigate]);

  /* -------------------- editPost 로 폼 초기값 채우기 -------------------- */
  useEffect(() => {
    if (!isEdit || !editPost) return;

    setRegion(editPost.regionName || "");
    setTitle(editPost.title || "");
    setContent(editPost.content || "");
    setTags(
      Array.isArray(editPost.tags) ? editPost.tags.join(" ") : ""
    );
    setPreview(editPost.imageUrl || null);
  }, [isEdit, editPost]);

  /* -------------------- 이미지 선택 -------------------- */
  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  /* -------------------- 제출 (작성 / 수정 공통) -------------------- */
  const handleSubmit = async () => {
    if (!region || !title.trim() || !content.trim()) {
      alert("지역, 제목, 본문을 모두 입력해주세요!");
      return;
    }

    const regionId = REGION_MAP[region];
    if (!regionId) {
      alert("유효한 지역을 선택해주세요!");
      return;
    }

    const parsedTags = tags
      .split(" ")
      .map((t) => t.trim())
      .filter(Boolean);

    let imageUrl = editPost?.imageUrl || "";
    let imageName = editPost?.imageName || "";

    try {
      // 새 이미지 업로드가 있으면 S3 업로드
      if (imageFile) {
        const uploaded = await uploadFile(imageFile);
        imageUrl = uploaded.result.imageUrl;
        imageName = uploaded.result.imageName;
      }

      //  공통 payload
      const payload = {
        title,
        content,
        imageUrl,
        imageName,
        regionId,
        tags: parsedTags,
      };

      // 3) 수정 모드
      if (isEdit) {
        const targetId = editPost?.postId ?? Number(postId);
        if (!targetId) {
          alert("수정할 게시글 정보를 찾을 수 없습니다.");
          return;
        }

        await updatePost(targetId, payload);

        alert("게시글이 수정되었습니다!");

        // 상세 페이지에서 다시 GET 하도록, state 없이 이동
        navigate(`/community/${targetId}`);
        return;
      }

      // 4) 작성 모드
      await postCommunity(payload);

      alert("게시글이 등록되었습니다!");

      navigate("/community", {
        state: {
          newPost: {
            title,
            content,
            imageUrl,
            tags: parsedTags,
          },
        },
      });
    } catch (error) {
      console.error("게시 실패:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  /* -------------------- 로딩 중 처리 -------------------- */
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <p className="text-gray-600 text-sm">게시글 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col relative">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between bg-[#FF7070] text-white px-5 py-3">
        <div className="flex items-center gap-3">
          <img src="/images/menuIcon.png" className="w-[22px] h-[22px]" />
          <img src="/images/notificationIcon.png" className="w-[20px] h-[20px]" />
        </div>

        <div className="flex items-center gap-1 bg-white text-[#FF7070] px-3 py-[4px] rounded-full">
          <img src="/images/User.png" className="w-5 h-5" />
          <span className="text-[13px] font-medium">홍홍홍</span>
        </div>
      </header>

      {/* 제목 영역 */}
      <div className="flex items-center justify-between bg-white px-5 py-5 border-b">
        <h1 className="text-[25px] font-semibold">
          {isEdit ? "게시글 수정" : "글쓰기"}
        </h1>

        <div className="flex items-center gap-4">
          <img src="/images/Edit.png" className="w-[25px]" />
          <img src="/images/User.png" className="w-[25px]" />
        </div>
      </div>

      {/* 뒤로가기 + 게시/수정 버튼 */}
      <div className="flex items-center justify-between bg-white px-5 py-3 mt-2">
        <button onClick={() => navigate("/community")}>
          <img
            src="/images/109618.png"
            alt="back"
            className="w-[28px] h-[28px]"
          />
        </button>

        <button
          onClick={handleSubmit}
          className="text-[#3D6AFF] text-[18px] font-semibold"
        >
          {isEdit ? "수정" : "게시"}
        </button>
      </div>

      {/* 이미지 업로드 영역 */}
      <div className="bg-white px-5 py-4 border-b">
        {preview ? (
          <label className="block">
            <img
              src={preview}
              className="w-full h-[370px] object-cover rounded-xl border cursor-pointer"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
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
        {/* 지역 */}
        <div>
          <label className="block text-[22px] font-semibold text-gray-800 mb-2">
            지역 선택
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[13px]"
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[13px]"
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
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[13px] h-[130px] resize-none"
          />
        </div>

        {/* 태그 */}
        <div>
          <label className="block text-[22px] font-semibold text-gray-800 mb-2">
            태그
          </label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="#태그를 공백으로 구분해서 입력"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[13px]"
          />
        </div>
      </div>

      {/* 하단 여백  */}
      <div className="h-[90px]" />
    </div>
  );
}
