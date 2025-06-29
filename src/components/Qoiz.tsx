import { useState, useRef, useEffect } from "react";

interface WasmExports {
  alloc: (n: number) => number;
  decode: (input: number, input_len: number) => bigint;
  arenaReset: () => void;
  memory: WebAssembly.Memory;
}

interface Image {
  ptr: number;
  width: number;
  height: number;
}

const bits = (start: number, size: number, v: bigint): bigint => {
  const mask = 0xffff_ffff_ffff_ffffn >> (64n - BigInt(size));
  return (v >> BigInt(start)) & mask;
};

const unwrapImage = (image: bigint): Image => {
  return {
    ptr: Number(bits(0, 32, image)),
    width: Number(bits(32, 16, image)),
    height: Number(bits(32 + 16, 16, image)),
  };
};

const textDecoder = new TextDecoder();

const decodeString = (
  memory: WebAssembly.Memory | null,
  ptr: number,
  len: number,
): string => {
  if (!memory) throw new Error("memory is not defined");
  if (len === 0) return "";

  return textDecoder.decode(new Uint8Array(memory.buffer, ptr, len));
};

async function load() {
  const init = (await import("../../zig-out/bin/qoi.wasm?init")).default;

  var memory: WebAssembly.Memory | null = null;

  const mod = await init({
    js: {
      log(level: number, ptr: number, len: number) {
        const msg = decodeString(memory, ptr, len);
        const logFns = [
          console.error,
          console.warn,
          console.info,
          console.debug,
        ];
        logFns[level]?.(msg);
      },
      panic(ptr: number, len: number) {
        const msg = decodeString(memory, ptr, len);
        throw new Error("panic: " + msg);
      },
    },
  });

  memory = mod.exports.memory as WebAssembly.Memory;

  return mod;
}

export default () => {
  const [file, setFile] = useState<File>();
  const [wasm, setWasm] = useState<WebAssembly.Instance | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLCanvasElement>(null);

  const processImageFile = async (file: File, canvas: HTMLCanvasElement) => {
    if (!wasm) return;

    const { memory, alloc, decode, arenaReset } = wasm.exports as WasmExports;

    const pixelStride = 4;

    const fileData = new Uint8Array(await file.arrayBuffer());
    const input = alloc(fileData.length);

    new Uint8Array(memory.buffer, input).set(fileData);

    const image = unwrapImage(decode(input, fileData.length));

    const ctx = canvasRef.current!.getContext("2d")!;
    canvas.width = image.width;
    canvas.height = image.height;

    const pixelData = new Uint8Array(
      memory.buffer,
      image.ptr,
      image.width * image.height * pixelStride,
    );
    const imageData = new ImageData(
      new Uint8ClampedArray(pixelData),
      image.width,
      image.height,
    );

    ctx.putImageData(imageData, 0, 0);
    arenaReset();
  };

  useEffect(() => {
    load().then(setWasm);
  }, []);

  useEffect(() => {
    if (file && wasm && canvasRef.current) {
      processImageFile(file, canvasRef.current);
    }
  }, [file, wasm]);

  return (
    <div className="relative flex max-w-[60ch] items-center justify-center p-4">
      <input
        ref={inputRef}
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
        type="file"
        accept=".qoi"
        className="hidden"
      />
      <div
        onClick={() => inputRef.current?.click()}
        className={`absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center rounded-xl border border-zinc-300 font-mono text-zinc-400 transition-all hover:bg-black/10`}
      >
        {wasm ? (file ? "" : "click to upload a qoi image") : "loading..."}
      </div>
      <canvas ref={canvasRef} className="max-w-full"></canvas>
    </div>
  );
};
