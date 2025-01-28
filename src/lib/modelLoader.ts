import * as tf from '@tensorflow/tfjs';

// Pre-trained MobileNet model for product recognition
let model: tf.GraphModel | null = null;

export async function loadModel() {
  if (!model) {
    try {
      // First ensure TensorFlow backend is initialized
      await tf.ready();
      await tf.setBackend('webgl');
      console.log('Using backend:', tf.getBackend());
      
      // Load the model with error handling
      model = await tf.loadGraphModel(
        'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/classification/3/default/1',
        { 
          fromTFHub: true,
          onProgress: (fraction) => {
            console.log(`Model loading progress: ${(fraction * 100).toFixed(1)}%`);
          }
        }
      );
      
      // Warm up the model
      const dummyInput = tf.zeros([1, 224, 224, 3]);
      await model.predict(dummyInput).dispose();
      dummyInput.dispose();
      
      console.log('Model loaded successfully');
      return model;
    } catch (error) {
      console.error('Error loading model:', error);
      throw new Error('Failed to load the AI model. Please check your connection and try again.');
    }
  }
  return model;
}

export async function preprocessImage(imageData: ImageData | HTMLImageElement): Promise<tf.Tensor> {
  try {
    // Convert image to tensor and preprocess
    const tensor = tf.tidy(() => {
      const imageTensor = tf.browser.fromPixels(imageData);
      // Resize to model's expected size
      const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
      // Normalize values to [-1, 1]
      const normalized = resized.toFloat().div(tf.scalar(127.5)).sub(tf.scalar(1));
      // Add batch dimension
      return normalized.expandDims(0);
    });
    
    return tensor;
  } catch (error) {
    console.error('Error preprocessing image:', error);
    throw new Error('Failed to process the image. Please try again.');
  }
}