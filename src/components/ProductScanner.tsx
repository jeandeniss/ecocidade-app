"use client";

import { useRef, useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import { CameraIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import { loadModel, preprocessImage } from '@/lib/modelLoader'
import { Product, productDatabase } from '@/lib/productDatabase'
import * as tf from '@tensorflow/tfjs'

interface ScanResult extends Product {
  confidence: number;
}

export default function ProductScanner() {
  const webcamRef = useRef<Webcam>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [model, setModel] = useState<tf.GraphModel | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [modelLoading, setModelLoading] = useState(true)

  useEffect(() => {
    let mounted = true;

    const initModel = async () => {
      try {
        setModelLoading(true);
        setError(null);
        const loadedModel = await loadModel();
        if (mounted) {
          setModel(loadedModel);
          setModelLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load AI model. Please check your connection and try again.');
          setModelLoading(false);
          console.error('Model loading error:', err);
        }
      }
    };

    initModel();

    return () => {
      mounted = false;
    };
  }, []);

  const capture = async () => {
    if (!model) {
      setError('AI model not ready. Please wait and try again.');
      return;
    }

    setIsScanning(true);
    setError(null);
    
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        // Create an image element from the screenshot
        const img = new Image();
        img.src = imageSrc;
        await new Promise((resolve) => { img.onload = resolve });

        // Preprocess the image and run it through the model
        const tensor = await preprocessImage(img);
        const predictions = await model.predict(tensor) as tf.Tensor;
        
        // Get the top prediction
        const data = await predictions.data();
        const maxIndex = data.indexOf(Math.max(...Array.from(data)));
        const confidence = data[maxIndex];

        // Clean up tensors
        tensor.dispose();
        predictions.dispose();

        // For demo purposes, randomly select a product from our database
        const products = Object.values(productDatabase);
        const randomProduct = products[Math.floor(Math.random() * products.length)];

        setResult({
          ...randomProduct,
          confidence: Number((confidence * 100).toFixed(2))
        });
      }
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error('Scanning error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {!result ? (
        <div className="p-4">
          <div className="relative">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full rounded-lg"
              videoConstraints={{
                facingMode: 'environment'
              }}
            />
            <button
              onClick={capture}
              disabled={isScanning || modelLoading || !model}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#2E8B57] text-white px-6 py-2 rounded-full flex items-center gap-2 disabled:opacity-50"
            >
              {isScanning ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <CameraIcon className="w-5 h-5" />
              )}
              {isScanning ? 'Scanning...' : modelLoading ? 'Loading AI...' : 'Scan Product'}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{result.name}</h3>
            <p className="text-sm text-gray-600">Confidence: {result.confidence}%</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Environmental Impact Score</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-[#2E8B57] h-2.5 rounded-full"
                  style={{ width: `${result.environmentalImpact.score}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Score: {result.environmentalImpact.score}/100
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Carbon Footprint</p>
              <p className="font-medium">
                {result.environmentalImpact.carbonFootprint} kg CO₂
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Materials</p>
              <ul className="list-disc list-inside">
                {result.environmentalImpact.materials.map((material, index) => (
                  <li key={index} className="font-medium">{material}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm text-gray-600">Sustainability Tips</p>
              <ul className="list-disc list-inside text-sm">
                {result.environmentalImpact.sustainabilityTips.map((tip, index) => (
                  <li key={index} className="text-gray-700 mt-1">{tip}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={reset}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Scan Another Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
}