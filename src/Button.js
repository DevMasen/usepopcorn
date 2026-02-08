export default function Button({ isOpen, onIsOpen }) {
	return (
		<button className="btn-toggle" onClick={() => onIsOpen(open => !open)}>
			{isOpen ? '–' : '+'}
		</button>
	);
}
