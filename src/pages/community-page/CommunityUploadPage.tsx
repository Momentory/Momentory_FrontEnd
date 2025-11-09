import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ImagePlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { postCommunity } from '../../api/community';

export default function CommunityUploadPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 이미지 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 게시글 등록 요청
  const handleSubmit = async () => {
    if (!title || !content) {
      alert('제목과 내용을 입력해주세요!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      setLoading(true);
      const res = await postCommunity(formData);
      console.log('등록 성공:', res);
      alert('게시글이 성공적으로 등록되었습니다 ');
      navigate('/community');
    } catch (err) {
      console.error('등록 실패:', err);
      alert('등록 중 오류가 발생했습니다 ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full min-h-screen bg-white flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 헤더 */}
      <div className="sticky top-0 w-full bg-white flex items-center justify-between px-4 py-3 border-b shadow-sm z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-[38px] h-[38px] rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-[17px] font-semibold text-gray-800">게시글 작성</h1>
        <div className="w-[38px]" />
      </div>

      {/* 입력 폼 */}
      <div className="w-[90%] flex flex-col gap-4 mt-6 mb-24">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-[10px] p-3 text-[15px] outline-none focus:border-[#FF7070]"
        />

        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="border border-gray-300 rounded-[10px] p-3 text-[15px] outline-none resize-none focus:border-[#FF7070]"
        />

        {/* 이미지 업로드 */}
        <div className="relative border-2 border-dashed border-gray-300 rounded-[12px] p-4 flex flex-col items-center justify-center text-gray-500 hover:border-[#FF7070] transition">
          {preview ? (
            <img
              src={preview}
              alt="미리보기"
              className="w-full h-[200px] object-cover rounded-[10px]"
            />
          ) : (
            <>
              <ImagePlus size={40} className="mb-2 text-gray-400" />
              <p className="text-[14px]">이미지를 업로드하세요</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* 등록 버튼 */}
      <div className="fixed bottom-20 w-full max-w-[480px] flex justify-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={loading}
          className={`w-[90%] ${
            loading ? 'bg-gray-400' : 'bg-[#FF7070]'
          } text-white text-[16px] font-semibold py-3 rounded-full shadow hover:bg-[#ff5a5a] transition`}
        >
          {loading ? '등록 중...' : '등록하기'}
        </motion.button>
      </div>
    </motion.div>
  );
}
