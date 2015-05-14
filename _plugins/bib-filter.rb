module Jekyll
  module BibliographyFilter
    def superscript_numerals(input)
	  input.gsub!(/([0-9])(th|st|nd|rd)/, '\1<sup>\2</sup>')
	  input
    end
	def escape_liquid(input)
	  input.gsub!(/\{\{/, '{2f62314e{')
	  input.gsub!(/\}\}/, '}2f62314e}')
	  input
	end
	def unescape_liquid(input)
	  input.gsub!(/2f62314e/, '')
	  input
	end
	def prune_author(input)
	  input.gsub!(/,/, '')
	  input.gsub!(/ and /, ', ')
	  input
	end
  end
  module Search
    class SearchIndexGenerator < Generator
	  def generate(site)
	    docs = site.pages.detect {|page| page.name == 'docs.json'}
	  end
	end
  end
end

Liquid::Template.register_filter(Jekyll::BibliographyFilter)
