import { useState, type ChangeEvent, type ReactNode } from 'react';
import errorIcon from '../../assets/icons/error.svg';
import EyeIcon from './EyeIcon';

type InputProps = {
  label?: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  rightElement?: ReactNode;
  id?: string;
};

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  rightElement,
  id,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex w-full flex-col gap-[6px]">
      {label && (
        <label htmlFor={id} className="body-02 text-gray-900 self-stretch">
          {label}
        </label>
      )}

      <div
        className={[
          'flex h-[45px] w-full items-center gap-1 rounded-2 border px-4 py-3 transition-colors',
          'bg-white hover:bg-gray-50',
          'focus-within:border-primary-500',
          error ? 'border-warning-400' : 'border-gray-100',
          disabled ? 'pointer-events-none opacity-60' : '',
        ].join(' ')}
      >
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={[
            'flex-1 bg-transparent outline-none body-03',
            'placeholder:text-gray-300',
            disabled ? 'text-gray-600' : 'text-gray-900',
          ].join(' ')}
        />

        {/* 비밀번호 eye 토글 */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="flex h-5 w-5 shrink-0 items-center justify-center"
            tabIndex={-1}
          >
            <EyeIcon
              color={
                error
                  ? 'var(--color-warning-400)'
                  : showPassword
                    ? 'var(--color-primary-500)'
                    : 'var(--color-gray-300)'
              }
            />
          </button>
        )}

        {/* 에러 아이콘 (비밀번호 제외) */}
        {!isPassword && error && (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center">
            <img src={errorIcon} alt="오류" className="h-[17px] w-[17px]" />
          </div>
        )}

        {/* 커스텀 우측 요소 (인증 버튼 등) */}
        {!isPassword && !error && rightElement}
      </div>

      {error && (
        <span className="body-04 px-2 text-warning-400">{error}</span>
      )}
    </div>
  );
}
