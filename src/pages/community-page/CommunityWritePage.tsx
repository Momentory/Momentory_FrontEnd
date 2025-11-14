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
  "성남시",
  "고양시",
  "용인시",
  "부천시",
  "안산시",
  "안양시",
  "남양주시",
  "화성시",
  "평택시",
  "의정부시",
  "시흥시",
  "파주시",
  "김포시",
  "광명시",
  "광주시",
  "군포시",
  "이천시",
  "양주시",
  "오산시",
  "구리시",
  "안성시",
  "포천시",
  "의왕시",
  "하남시",
  "여주시",
  "양평군",
  "동두천시",
  "과천시",
  "가평군",
  "연천군",
  "기타",
];

const REGION_MAP: Record<string, number> = {
  수원시: 1,
  성남시: 2,
  고양시: 3,
  용인시: 4,
  부천시: 5,
  안산시: 6,
  안양시: 7,
  남양주시: 8,
  화성시: 9,
  평택시: 10,
  의정부시: 11,
  시흥시: 12,
  파주시: 13,
  김포시: 14,
  광명시: 15,
  광주시: 16,
  군포시: 17,
  이천시: 18,
  양주시: 19,
  오산시: 20,
  구리시: 21,
  안성시: 22,
  포천시: 23,
  의왕시: 24,
  하남시: 25,
  여주시: 26,
  양평군: 27,
  동두천시: 28,
  과천시: 29,
  가평군: 30,
  연천군: 31,
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

    // 태그는 공백 기준으로 분리
    const parsedTags = tags
      .split(" ")
      .map((t) => t.trim())
      .filter(Boolean);

    let imageUrl = editPost?.imageUrl || "";
    let imageName = editPost?.imageName || "";

    try {
      // 1) 새 이미지 업로드가 있으면 S3 업로드
      if (imageFile) {
        const uploaded = await uploadFile(imageFile);
        imageUrl = uploaded.result.imageUrl;
        imageName = uploaded.result.imageName;
      }

      // 2) 공통 payload
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
      const res = await postCommunity(payload);

      alert("게시글이 등록되었습니다!");

      // 백엔드가 생성된 postId 를 준다면 여기서 꺼내서 상세로 이동해도 됨
      // const newId = res.data?.result?.postId;
      // if (newId) navigate(`/community/${newId}`);
      // else navigate("/community");

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

      {/* 하단 여백 (탭바 공간) */}
      <div className="h-[90px]" />
    </div>
  );
}
