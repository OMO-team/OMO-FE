interface ProsConsProps {
  pros: string[];
  cons: string[];
}

export default function ProsCons({ pros, cons }: ProsConsProps) {
  return (
    <div className="flex flex-col justify-start items-start self-stretch gap-5">
      <div className="flex flex-col justify-start items-start self-stretch relative gap-2">
        <p className="heading-06 text-black self-stretch">장점</p>
        <div className="flex flex-col justify-start items-start self-stretch relative gap-1">
          {pros.map((item) => (
            <p key={item} className="body-02 text-gray-700 self-stretch">
              {item}
            </p>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-start items-start self-stretch relative gap-2">
        <p className="heading-06 text-black self-stretch">단점</p>
        <div className="flex flex-col justify-start items-start self-stretch relative gap-1">
          {cons.map((item) => (
            <p key={item} className="body-02 text-gray-700 self-stretch">
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
