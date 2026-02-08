import { useState } from 'react';
import Button from './Button';
export default function Box({ children }) {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<div className="box">
			<Button isOpen={isOpen} onIsOpen={setIsOpen} />
			{isOpen && children}
		</div>
	);
}
