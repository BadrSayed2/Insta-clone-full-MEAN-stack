import { Component, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PostService, ApiResponse } from "app/services/post.service";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { finalize } from "rxjs";

@Component({
  selector: "app-create-post",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "create-post.html",
  styleUrls: ["create-post.css"],
})
export class CreatePostComponent implements OnDestroy {
  file: File | null = null;
  previewUrl: string | null = null;
  isVideo = false;
  caption = "";
  maxCaption = 2200;
  uploading = false;
  dragOver = false;
  toast = {
    visible: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  };
  private toastTimer?: any;
  constructor(private postService: PostService) {}
  //h2 Function to handle file selection
  onFileSelected(event: Event, replace = false) {
    const input = event.target as HTMLInputElement;
    //h1 1) if user not select file do nothing
    if (!input.files || input.files.length === 0) return;
    //h1 2) if user select one file or more than one file take only first file
    const f = input.files[0];
    //h1 3) if user select file type is not supported show alert and clear input
    if (!this.isSupportedType(f.type)) {
      this.toastError(
        "Unsupported file type. Please choose an image or video."
      );
      input.value = "";
      return;
    }
    if (replace) this.revokePreview();
    this.file = f;
    this.isVideo = f.type.startsWith("video/");
    this.previewUrl = URL.createObjectURL(f);
  }

  onDrop(evt: DragEvent) {
    //1) browser by default open the video
    evt.preventDefault();
    //2) after file is dropped stop giving it highlight
    this.dragOver = false;
    // 3) get all files user dropped but only we care about first one
    const files = evt.dataTransfer?.files;
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!this.isSupportedType(f.type)) {
      this.toastError("Unsupported file type. Please drop an image or video.");
      return;
    }
    this.revokePreview();
    this.file = f;
    this.isVideo = f.type.startsWith("video/");
    this.previewUrl = URL.createObjectURL(f);
  }
  // Function to handle drag over event and highlight the drop area
  onDragOver(evt: DragEvent) {
    evt.preventDefault();
    this.dragOver = true;
  }
  // Function to handle drag leave event and remove highlight from the drop area
  onDragLeave(_: DragEvent) {
    this.dragOver = false;
  }

  removeFile() {
    this.revokePreview();
    this.file = null;
    this.isVideo = false;
  }

  reset() {
    this.caption = "";
    this.removeFile();
  }

  submit() {
    if (!this.file || this.uploading) return;
    const trimmed = this.caption.trim();
    if (trimmed.length > this.maxCaption) {
      this.toastError("Caption is too long.");
      return;
    }

    const form = new FormData();
    form.append("caption", trimmed);
    // Backend expects specific field names for multer
    const fileField = this.isVideo ? "post_video" : "post_pic";
    form.append(fileField, this.file);
    // Optional metadata (backend can ignore if not used)
    form.append("mediaType", this.isVideo ? "video" : "image");

    this.uploading = true;
    this.postService
      .createPost(form)
      .pipe(finalize(() => (this.uploading = false)))
      .subscribe({
        next: (res: HttpResponse<ApiResponse>) => {
          const ok = res.status >= 200 && res.status < 300;
          if (ok) {
            this.reset();
            const msg = res.body?.message || "Post created successfully.";
            this.toastSuccess(msg);
          } else {
            this.toastError(
              `Failed to create post: Server responded with status ${res.status}`
            );
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error("Create post failed", err);
          const msg = err.error?.message || err.message || "Unknown error";
          this.toastError(`Failed to create post. ${msg}`);
        },
      });
  }
  // function to check if uploaded file type is supported
  private isSupportedType(mime: string) {
    return mime.startsWith("image/") || mime.startsWith("video/");
  }

  private revokePreview() {
    //h1 1) if user not select file do nothing
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = null;
  }

  ngOnDestroy(): void {
    this.revokePreview();
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  private toastShow(
    message: string,
    type: "success" | "error" | "info" = "info",
    duration = 2500
  ) {
    this.toast.visible = true;
    this.toast.message = message;
    this.toast.type = type;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toast.visible = false;
    }, duration);
  }

  private toastSuccess(message: string) {
    this.toastShow(message, "success");
  }

  private toastError(message: string) {
    this.toastShow(message, "error", 3500);
  }

  toastHide() {
    this.toast.visible = false;
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }
}
