require "jekyll-assets"
require "sprockets"
require "uglifier"

Sprockets.register_compressor 'application/javascript',
  :uglifier_with_copyright, Uglifier.new(:comments => :copyright)
