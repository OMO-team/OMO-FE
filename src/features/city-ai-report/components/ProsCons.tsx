interface ProsConsProps {
  pros: string[];
  cons: string[];
  prosEmpty: boolean;
  consEmpty: boolean;
}

export default function ProsCons({ pros, cons, prosEmpty, consEmpty }: ProsConsProps) {
  return (
    <div className="flex justify-start items-start self-stretch gap-5">
      <div className="flex flex-col justify-start items-start flex-1 min-w-0 relative gap-1">
        <p className="heading-06 text-black self-stretch">장점</p>
        {prosEmpty ? (
          <p className="body-02 text-gray-400 self-stretch">아직 수집된 장점 정보가 없어요.</p>
        ) : (
          <ul className="flex flex-col justify-start items-start self-stretch relative gap-1 list-disc pl-5">
            {pros.map((item) => (
              <li key={item} className="body-02 text-gray-700 self-stretch">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col justify-start items-start flex-1 min-w-0 relative gap-1">
        <p className="heading-06 text-black self-stretch">단점</p>
        {consEmpty ? (
          <p className="body-02 text-gray-400 self-stretch">아직 수집된 단점 정보가 없어요.</p>
        ) : (
          <ul className="flex flex-col justify-start items-start self-stretch relative gap-1 list-disc pl-5">
            {cons.map((item) => (
              <li key={item} className="body-02 text-gray-700 self-stretch">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
