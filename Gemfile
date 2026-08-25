source "https://rubygems.org"

# Pinned so the deployed build matches what was tested locally. GitHub Pages'
# built-in builder is stuck on Jekyll 3.9; the Actions workflow in
# .github/workflows/pages.yml uses this file instead.
gem "jekyll", "~> 4.4"

# Windows/JRuby only — harmless elsewhere.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end
