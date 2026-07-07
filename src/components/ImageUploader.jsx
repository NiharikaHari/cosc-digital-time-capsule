import { readFileAsDataURL } from "../utils/fileUtils";

export default function ImageUploader({ images, onChange }) {
  async function handleFiles(e) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    const newImages = await Promise.all(
      files.map(async (file) => ({
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        dataUrl: await readFileAsDataURL(file),
      }))
    );
    onChange([...images, ...newImages]);
  }

  function handleRemove(id) {
    onChange(images.filter((image) => image.id !== id));
  }

  return (
    <div className="image-uploader">
      {images.length > 0 && (
        <div className="image-uploader-previews">
          {images.map((image) => (
            <div key={image.id} className="image-uploader-thumb">
              <img src={image.dataUrl} alt={image.name} />
              <button
                type="button"
                className="image-uploader-remove"
                onClick={() => handleRemove(image.id)}
                aria-label={`Remove ${image.name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="image-uploader-trigger">
        + Add photos
        <input type="file" accept="image/*" multiple onChange={handleFiles} hidden />
      </label>
    </div>
  );
}
