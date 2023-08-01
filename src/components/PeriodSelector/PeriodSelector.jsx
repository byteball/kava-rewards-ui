import cn from "classnames";

export const PeriodSelector = ({ className, periods = [], active, setActive = () => { } }) => (<div className={cn("flex select-none text-sm space-x-5 no-scrollbar overflow-y-scroll border-b pb-3 border-b-primary-gray/60", className)}>
	{periods.map(({ value, title }) => <div key={value} className={cn("rounded-lg  px-3 py-2 text-white/60 hover:text-white/80  shrink-0", active === value ? "bg-primary-gray rounded-lg text-white/80 cursor-default" : "cursor-pointer hover:bg-primary-gray/70")} onClick={() => setActive(value)}>{title}</div>)}
</div>)