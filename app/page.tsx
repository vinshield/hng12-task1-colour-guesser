"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";

const COLORS = [
	"#FF0000",
	"#00FF00",
	"#0000FF",
	"#FFFF00",
	"#FF00FF",
	"#00FFFF",
];

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
	const newArray = [...array];
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	}
	return newArray;
}

export default function ColorGuessingGame() {
	const [targetColor, setTargetColor] = useState("");
	const [options, setOptions] = useState<string[]>([]);
	const [gameStatus, setGameStatus] = useState("");
	const [score, setScore] = useState(0);
	const [showTarget, setShowTarget] = useState(true);

	useEffect(() => {
		startNewGame();
	}, []);

	const startNewGame = () => {
		const shuffledColors = shuffleArray(COLORS);
		const newTarget = shuffledColors[0];
		setTargetColor(newTarget);
		setOptions(shuffleArray([...shuffledColors])); // Shuffle again to randomize positions
		setGameStatus("");
		setShowTarget(true);
		setTimeout(() => {
			setShowTarget(false);
		}, 1000); // Hide the target color after 3 seconds
	};

	const handleGuess = (color: string) => {
		if (color === targetColor) {
			setGameStatus("Correct! +1 point");
			setScore((prevScore) => prevScore + 1);
			setTimeout(startNewGame, 1500); // Start a new game after 1.5 seconds
		} else {
			setGameStatus("Wrong! -1 point");
			setScore((prevScore) => Math.max(0, prevScore - 1)); // Ensure score doesn't go below 0
		}
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
			<h1 className='text-3xl font-bold mb-6'>Color Guessing Game</h1>

			{showTarget ? (
				<div
					data-testid='colorBox'
					className='w-32 h-32 mb-6 border-4 border-gray-300 shadow-lg transition-opacity duration-500'
					style={{ backgroundColor: targetColor }}
				></div>
			) : (
				<>
					<p data-testid='gameInstructions' className='text-lg mb-4'>
						Select the color you just saw!
					</p>

					<div className='grid grid-cols-3 gap-4 mb-6'>
						{options.map((color, index) => (
							<Button
								key={index}
								data-testid='colorOption'
								className='w-20 h-20 rounded-full transition-transform hover:scale-110'
								style={{ backgroundColor: color }}
								onClick={() => handleGuess(color)}
							/>
						))}
					</div>
				</>
			)}

			{gameStatus && (
				<div
					data-testid='gameStatus'
					className={`flex items-center mb-4 text-lg font-semibold ${
						gameStatus.includes("Correct") ? "text-green-600" : "text-red-600"
					}`}
				>
					{gameStatus.includes("Correct") ? (
						<CheckCircle className='mr-2' />
					) : (
						<AlertCircle className='mr-2' />
					)}
					{gameStatus}
				</div>
			)}

			<p data-testid='score' className='text-xl font-bold mb-6'>
				Score: {score}
			</p>

			<Button
				data-testid='newGameButton'
				onClick={startNewGame}
				className='px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
			>
				New Game
			</Button>
		</div>
	);
}
