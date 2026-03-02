import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
    label: string;
    onSave: (dataURL: string, signedAt?: string) => void;
    existingSignature?: string | null;
    readOnly?: boolean;
}

export default function SignaturePad({ label, onSave, existingSignature, readOnly = false }: SignaturePadProps) {
    const padRef = useRef<SignatureCanvas>(null);
    const [isSigned, setIsSigned] = useState(false);
    const [showPad, setShowPad] = useState(!existingSignature);

    const clear = () => {
        padRef.current?.clear();
        setIsSigned(false);
        onSave('', undefined);
    };

    const save = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const pad = padRef.current;
        if (!pad) return;

        try {
            if (pad.isEmpty()) return;

            // Workaround for getTrimmedCanvas() failure in Vite/ESM environments
            // due to trim-canvas library import issues.
            let canvas = pad.getCanvas();

            // Simple manual trim logic
            const context = canvas.getContext('2d');
            if (context) {
                const width = canvas.width;
                const height = canvas.height;
                const imageData = context.getImageData(0, 0, width, height);
                const data = imageData.data;

                let top = -1,
                    bottom = -1,
                    left = -1,
                    right = -1;

                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const alpha = data[(y * width + x) * 4 + 3];
                        if (alpha > 0) {
                            if (top === -1) top = y;
                            bottom = y;
                            if (left === -1 || x < left) left = x;
                            if (right === -1 || x > right) right = x;
                        }
                    }
                }

                if (top !== -1) {
                    const trimmedWidth = right - left + 1;
                    const trimmedHeight = bottom - top + 1;
                    const trimmedCanvas = document.createElement('canvas');
                    trimmedCanvas.width = trimmedWidth;
                    trimmedCanvas.height = trimmedHeight;
                    const trimmedContext = trimmedCanvas.getContext('2d');
                    if (trimmedContext) {
                        trimmedContext.drawImage(
                            canvas,
                            left,
                            top,
                            trimmedWidth,
                            trimmedHeight,
                            0,
                            0,
                            trimmedWidth,
                            trimmedHeight,
                        );
                        canvas = trimmedCanvas;
                    }
                }
            }

            const dataURL = canvas.toDataURL('image/png');
            if (!dataURL || dataURL.length < 100) return;
            const signedAt = new Date().toISOString();
            setIsSigned(true);
            onSave(dataURL, signedAt);
            setShowPad(false);
        } catch (err) {
            console.error('Signature save failed:', err);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            
            {!showPad && existingSignature && (
                <div className="border border-gray-200 rounded-md p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center gap-2">
                    <img src={existingSignature} alt={`${label} signature`} className="max-h-32 object-contain filter dark:invert" />
                    {!readOnly && (
                        <button 
                            type="button" 
                            onClick={() => { setShowPad(true); }}
                            className="text-xs text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                            Re-sign
                        </button>
                    )}
                </div>
            )}

            {showPad && !readOnly && (
                <div className="flex flex-col gap-2 relative border border-gray-200 rounded-md overflow-hidden dark:border-gray-600">
                    <div className="bg-white">
                        <SignatureCanvas 
                            ref={padRef} 
                            canvasProps={{ className: 'w-full h-32' }} 
                            onEnd={() => { setIsSigned(!padRef.current?.isEmpty()); }}
                        />
                    </div>
                    <div className="bg-gray-50 px-3 py-2 flex justify-end gap-2 border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); clear(); }}
                            className="text-xs text-gray-600 hover:text-gray-500 font-medium dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            Clear
                        </button>
                        <button 
                            type="button" 
                            onClick={(e) => save(e)}
                            disabled={!isSigned}
                            className="text-xs bg-indigo-600 text-white hover:bg-indigo-500 font-medium px-3 py-1 rounded disabled:opacity-50"
                        >
                            Save Signature
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
