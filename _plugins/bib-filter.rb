module Jekyll
  module BibliographyFilter
    def superscript_numerals(input)
	  input.gsub!(/([0-9])(th|st|nd|rd)\b/, '\1<sup>\2</sup>')
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
	def dates(input)
	  twoDates = input.split(' ')
	  date1 = Date.parse(twoDates[0])
	  date2 = Date.parse(twoDates[1])
	  day1 = date1.strftime('%-d')
	  dayN = date2.strftime('%-d')
	  date1.strftime(day1 + '&ndash;' + dayN + ' %b %Y')
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
