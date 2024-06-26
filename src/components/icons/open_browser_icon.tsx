import { iSVG } from "../../interfaces/svg";

function OpenBrowserIcon(props: iSVG): JSX.Element {
	const { size, fill } = props;

	return (
		<svg
			data-testid={"open-browser-icon"}
			role="img"
			xmlns="http://www.w3.org/2000/svg"
			height={size}
			viewBox="0 -960 960 960"
			width={size}
		>
			<path
				fill={fill}
				d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H570v-60h210v-540H180v540h210v60H180Zm270 0v-284l-83 83-43-43 156-156 156 156-43 43-83-83v284h-60Z"
			/>
		</svg>
	);
}

export default OpenBrowserIcon;
