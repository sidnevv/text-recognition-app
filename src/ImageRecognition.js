import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './ImageRecognition.css'; // Импорт CSS файла

const ImageRecognition = () => {
    const [imageSrc, setImageSrc] = useState('');
    const [recognizedText, setRecognizedText] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('eng'); // Стейт для выбранного языка
    const [loading, setLoading] = useState(false); // Стейт для отображения лоадера

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleFile = (file) => {
        const reader = new FileReader();

        reader.onload = () => {
            setImageSrc(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const recognizeText = async () => {
        if (!imageSrc) return;

        setLoading(true);

        try {
            const { data: { text } } = await Tesseract.recognize(imageSrc, selectedLanguage, {
                logger: (m) => console.log(m), // Optional logger callback
            });

            setRecognizedText(text);
        } catch (error) {
            console.error('Error recognizing text:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageChange = (e) => {
        setSelectedLanguage(e.target.value);
    };

    return (
        <div className="container" onDrop={handleDrop} onDragOver={handleDragOver}>
            <label htmlFor="fileInput" className="upload-label">
                <div className="upload-container">
                    <input type="file" id="fileInput" onChange={handleImageChange} style={{ display: 'none' }} />
                    Drag & Drop or Click Here to Upload Image
                    {imageSrc && <img src={imageSrc} alt="Uploaded" className="uploaded-image" />}
                </div>
            </label>
            <div className="controls-container">
                <select value={selectedLanguage} onChange={handleLanguageChange}>
                    <option value="eng">English</option>
                    <option value="rus">Russian</option>
                </select>
                <button onClick={recognizeText} disabled={loading}>
                    {loading ? 'Recognizing...' : 'Recognize Text'}
                </button>
            </div>
            {loading && <div className="loader"></div>}
            {recognizedText && (
                <div className="recognized-text">
                    <h3>Recognized Text:</h3>
                    <p>{recognizedText}</p>
                </div>
            )}
        </div>
    );
};

export default ImageRecognition;
