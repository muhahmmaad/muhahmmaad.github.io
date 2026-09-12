(function () {
  function cmsToken() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key || !/cms/i.test(key)) continue;
        var parsed = JSON.parse(localStorage.getItem(key) || "{}");
        if (parsed.token) return parsed.token;
      }
    } catch (err) {}
    return "";
  }

  function fieldOpt(field, name, fallback) {
    if (!field) return fallback;
    if (typeof field.get === "function") {
      var v = field.get(name);
      return v == null ? fallback : v;
    }
    return field[name] != null ? field[name] : fallback;
  }

  function uploadJpeg(blob, filename) {
    return blob.arrayBuffer().then(function (buf) {
      var bytes = new Uint8Array(buf);
      var binary = "";
      for (var i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      var token = cmsToken();
      if (!token) return Promise.reject(new Error("Login again, then crop."));
      var path = "assets/img/uploads/" + filename;
      return fetch(
        "https://api.github.com/repos/muhahmmaad/muhahmmaad.github.io/contents/" + path,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
            Accept: "application/vnd.github+json",
          },
          body: JSON.stringify({
            message: "Upload cropped photo " + filename,
            content: btoa(binary),
            branch: "main",
          }),
        }
      )
        .then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok) throw new Error(data.message || "Upload failed");
            return "/" + data.content.path;
          });
        });
    });
  }

  function openCropper(src, aspect, onDone, onCancel) {
    var modal = document.createElement("div");
    modal.className = "crop-modal";
    modal.innerHTML =
      '<div class="crop-modal__box">' +
        '<p class="crop-modal__hint">Drag and zoom until the photo sits in the frame, then Apply.</p>' +
        '<div class="crop-modal__stage"><img alt="Crop"></div>' +
        '<div class="crop-modal__actions">' +
          '<button type="button" class="crop-modal__cancel">Cancel</button>' +
          '<button type="button" class="crop-modal__apply">Apply crop</button>' +
        "</div>" +
      "</div>";
    document.body.appendChild(modal);
    var img = modal.querySelector("img");
    var cropper;
    img.onload = function () {
      cropper = new Cropper(img, {
        aspectRatio: aspect || 1,
        viewMode: 1,
        autoCropArea: 1,
        background: false,
        guides: true,
        center: true,
        dragMode: "move",
      });
    };
    img.src = src;

    function destroy() {
      if (cropper) cropper.destroy();
      modal.remove();
    }

    modal.querySelector(".crop-modal__cancel").onclick = function () {
      destroy();
      if (onCancel) onCancel();
    };
    modal.querySelector(".crop-modal__apply").onclick = function () {
      if (!cropper) return;
      var canvas = cropper.getCroppedCanvas({
        maxWidth: 1600,
        maxHeight: 1600,
        fillColor: "#ffffff",
        imageSmoothingQuality: "high",
      });
      canvas.toBlob(
        function (blob) {
          destroy();
          onDone(blob);
        },
        "image/jpeg",
        0.92
      );
    };
  }

  window.registerCropWidget = function () {
    var Control = createClass({
      getInitialState: function () {
        return { busy: false, error: "" };
      },
      pickFile: function () {
        if (this._input) this._input.click();
      },
      recrop: function () {
        var value = this.props.value;
        if (!value) return this.pickFile();
        this.runCrop(value);
      },
      onFile: function (event) {
        var file = event.target.files && event.target.files[0];
        event.target.value = "";
        if (!file) return;
        this.runCrop(URL.createObjectURL(file));
      },
      runCrop: function (src) {
        var self = this;
        var ar = fieldOpt(this.props.field, "aspect_ratio", "1");
        var ratio = 1;
        if (String(ar).indexOf("/") !== -1) {
          var parts = String(ar).split("/");
          ratio = Number(parts[0]) / Number(parts[1]);
        } else if (ar) {
          ratio = Number(ar) || 1;
        }
        this.setState({ error: "", busy: true });
        openCropper(
          src,
          ratio,
          function (blob) {
            uploadJpeg(blob, "crop-" + Date.now() + ".jpg")
              .then(function (path) {
                self.props.onChange(path);
                self.setState({ busy: false, error: "" });
              })
              .catch(function (err) {
                self.setState({ busy: false, error: String(err.message || err) });
              });
          },
          function () {
            self.setState({ busy: false });
          }
        );
      },
      render: function () {
        var value = this.props.value;
        var self = this;
        return h(
          "div",
          { className: "crop-widget" },
          value
            ? h("img", { src: value, alt: "", className: "crop-widget__preview" })
            : h("div", { className: "crop-widget__empty" }, "No photo yet"),
          h(
            "div",
            { className: "crop-widget__row" },
            h(
              "button",
              { type: "button", className: "crop-widget__btn", onClick: this.pickFile, disabled: this.state.busy },
              this.state.busy ? "Working…" : "Upload & crop"
            ),
            value
              ? h(
                  "button",
                  { type: "button", className: "crop-widget__btn crop-widget__btn--ghost", onClick: this.recrop, disabled: this.state.busy },
                  "Fit in frame"
                )
              : null
          ),
          this.state.error ? h("p", { className: "crop-widget__err" }, this.state.error) : null,
          h("input", {
            type: "file",
            accept: "image/*",
            style: { display: "none" },
            onChange: this.onFile,
            ref: function (el) {
              self._input = el;
            },
          })
        );
      },
    });

    CMS.registerWidget("crop-image", Control);
  };
})();
