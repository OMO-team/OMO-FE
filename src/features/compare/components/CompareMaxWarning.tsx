export default function CompareMaxWarning() {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full border"
      style={{
        borderColor: '#FFCDC9',
        backgroundColor: '#FFECEB',
        padding: '6px 14px',
        boxShadow: '0 3px 8px 0 rgba(6, 49, 88, 0.16)',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10.75 0.75C5.227 0.75 0.75 5.227 0.75 10.75C0.75 16.273 5.227 20.75 10.75 20.75C16.273 20.75 20.75 16.273 20.75 10.75C20.75 5.227 16.273 0.75 10.75 0.75Z"
          stroke="#EB1600"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.75 6.75V10.75M10.75 14.75L10.74 14.75"
          stroke="#EB1600"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="body-04 whitespace-nowrap" style={{ color: '#CC1400' }}>
        최대 3개까지 비교할 수 있어요.
      </span>
    </div>
  );
}
