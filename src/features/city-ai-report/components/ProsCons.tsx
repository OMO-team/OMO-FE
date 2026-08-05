interface ProsConsProps {
  pros: string[];
  cons: string[];
}

export default function ProsCons({ pros, cons }: ProsConsProps) {
  return (
    <div className="flex flex-col justify-start items-start self-stretch gap-5">
      <div className="flex flex-col justify-start items-start self-stretch relative gap-2">
        <p className="heading-06 text-black self-stretch">장점</p>
        <ul className="flex flex-col justify-start items-start self-stretch relative gap-1 list-disc pl-5">
          {pros.map((item) => (
            <li key={item} className="body-02 text-gray-700 self-stretch">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col justify-start items-start self-stretch relative gap-2">
        <p className="heading-06 text-black self-stretch">단점</p>
        <ul className="flex flex-col justify-start items-start self-stretch relative gap-1 list-disc pl-5">
          {cons.map((item) => (
            <li key={item} className="body-02 text-gray-700 self-stretch">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
