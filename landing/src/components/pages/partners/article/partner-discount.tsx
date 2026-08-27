type DiscountBannerProps = {
  percent: number;
  text: string;
  promo: string | null;
};

const DiscountBanner = ({ percent, text, promo }: DiscountBannerProps) => {
  return (
    <div className="rounded-small my-5 bg-white px-10 py-8 md:my-9">
      <mark className="flex flex-col bg-transparent text-[#797979] max-md:text-center md:flex-row md:items-center">
        <span className="text-[2.5rem] leading-none font-bold tracking-[-1.2px] text-[#1B1B1C]">{percent}%</span>

        <hr className="w-full border-t border-[#E8E8E8] max-md:my-5 md:mx-9 md:h-auto md:w-0 md:self-stretch md:border-t-0 md:border-l" />

        <span className="text-xl leading-[1.2] md:leading-[1.4]">
          {text} {promo && <span className="text-[#1B1B1C]">{promo}</span>}
        </span>
      </mark>
    </div>
  );
};

export default DiscountBanner;
