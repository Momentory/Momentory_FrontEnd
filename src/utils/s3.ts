/**
 * S3 REST Endpoint URL을 CloudFront URL로 변환합니다.
 * CORS 문제를 해결하고 더 빠른 콘텐츠 전송을 위해 CloudFront를 사용합니다.
 *
 * @param url - S3 REST Endpoint URL
 * @returns CloudFront URL
 *
 * @example
 * // S3 REST Endpoint (CORS 에러 발생)
 * const s3Url = "https://momentory-bucket.s3.ap-northeast-2.amazonaws.com/image.jpg";
 *
 * // CloudFront URL (CORS 정상 동작 + CDN 가속)
 * const cdnUrl = toS3WebsiteUrl(s3Url);
 * // "https://d3y2ngyojcr5n.cloudfront.net/image.jpg"
 */
export const toS3WebsiteUrl = (url: string): string => {
  if (!url) return url;

  // 이미 CloudFront URL인 경우 그대로 반환
  if (url.includes('cloudfront.net')) {
    return url;
  }

  // S3 Website Endpoint를 CloudFront URL로 변환
  if (url.includes('s3-website')) {
    return url.replace(
      'http://momentory-bucket.s3-website.ap-northeast-2.amazonaws.com',
      'https://d3y2ngyojcr5n.cloudfront.net'
    );
  }

  // S3 REST Endpoint를 CloudFront URL로 변환
  return url.replace(
    'https://momentory-bucket.s3.ap-northeast-2.amazonaws.com',
    'https://d3y2ngyojcr5n.cloudfront.net'
  );
};

/**
 * 여러 개의 S3 URL을 CloudFront URL로 일괄 변환합니다.
 *
 * @param urls - S3 URL 배열
 * @returns CloudFront URL 배열
 */
export const toS3WebsiteUrls = (urls: string[]): string[] => {
  return urls.map(toS3WebsiteUrl);
};
