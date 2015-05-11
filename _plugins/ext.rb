require 'jekyll/multiple/languages/plugin'
require 'csl/styles'
require_relative 'jekyll-scholar-hacked/jekyll/scholar'

module Jekyll
  module BibliographyFilter
    def superscript_numerals(input)
	  input.gsub!(/([0-9])(th|st|nd|rd)/, '\1<sup>\2</sup>')
	  input
    end
  end
end

Liquid::Template.register_filter(Jekyll::BibliographyFilter)
