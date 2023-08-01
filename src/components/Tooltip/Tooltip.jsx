import RcTooltip from "rc-tooltip";

export const Tooltip = ({ description, children }) => {
	if (!description) return <span>{children}</span>;

	return (
		<RcTooltip
			placement="top"
			trigger={["hover"]}
			overlayClassName="max-w-[250px]"
			overlay={<span>{description}</span>}
		>
			{children}
		</RcTooltip>
	);
};
