import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/auth';
import { tokenStore } from '../../lib/token';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const data = await login({ email, password });
      tokenStore.set({
        accessToken: data.result.accessToken,
        refreshToken: data.result.refreshToken,
      });

      alert('로그인 성공!');
      
      navigate('/home'); // 로그인 성공 시 이동할 페이지
      
    } catch (err: any) {
      console.error('로그인 에러 전체:', err);
      console.error('응답 데이터:', err.response?.data);
      console.error('상태 코드:', err.response?.status);

      const errorMessage =
        err.response?.data?.message ||
        '이메일 또는 비밀번호가 올바르지 않습니다.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white relative">
      {/* 뒤로가기 버튼 */}
      <img
        src="/images/109618.png"
        alt="뒤로가기"
        className="absolute top-[25px] left-[25px] w-[30px] h-[30px] cursor-pointer"
        onClick={() => navigate(-1)}
      />

      {/* 로그인 박스 */}
      <div className="w-[330px] border border-gray-300 rounded-[10px] p-6 text-center">
        <h1 className="text-[28px] font-bold text-black mb-6">로그인</h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="abc@naver.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[50px] rounded-[12px] border border-gray-300 px-4 text-[15px] placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[50px] rounded-[12px] border border-gray-300 px-4 text-[15px] placeholder-gray-400"
          />

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-[55px] text-white text-[16px] font-semibold rounded-[15px] ${
              loading ? 'bg-gray-400' : 'bg-[#FF7070]'
            } transition active:scale-95`}
          >
            {loading ? '로그인중...' : '로그인'}
          </button>
        </form>

        {/* 하단 링크 */}
        <div className="mt-5 text-[13px] text-gray-500">
          <Link to="/find-id" className="hover:underline">
            아이디 찾기
          </Link>{' '}
          |{' '}
          <Link to="/find-password" className="hover:underline">
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}