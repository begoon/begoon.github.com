def ask(prompt, choices)
  while true 
    print "%s [%s, %s]? " % [prompt, choices[0].upcase, choices[1..-1].join(", ")]
    ans = gets.downcase.strip
    ans = choices[0] if ans.empty?
    puts ans
    return ans if choices.include? ans
  end
end

def yesno(prompt)
  ask(prompt, ["y", "n"])
end

def confirm(prompt)
  yesno(prompt) == "y"
end

def enter(prompt, value, confirm = true)
  while true
    print "%s ([%s], enter to confirm): " % [prompt, value]
    s = gets.strip
    puts s
    return s if not confirm
    return value if s.empty? and (not value.empty?)
    value = s
  end
end

def correct_date?(date)
  m = /(201\d)-(\d{2})-(\d{2}) (\d{2})\:(\d{2})/.match(date)
  return false if m == nil
  return false if m[1].to_i < 2012
  return false if not (1..12).include? m[2].to_i
  return false if not (1..31).include?(m[3].to_i)
  return false if not (0..23).include?(m[4].to_i)
  return false if not (0..59).include?(m[5].to_i)
  true
end

def write_file(name, printer)
  open(name, 'w') do |file|
    printer.call(file, name)
    puts "Written to '%s'" % name
  end
end

def edit_file(name)
  editor = RUBY_PLATFORM.index("mingw") != nil ? "npp" : "mate"
  system "%s %s" % [editor, name]
  puts
end

def enter_categories(language)
  categories = {}
  categories[language] = true
  while true do
    category = enter("Categories (%s)" % categories.keys.join(", "), "", false)
    break if category.empty?
    if category.start_with? "-" then
      categories.delete category[1..-1]
    else
      categories[category] = true
    end
  end
  categories
end

def make_filename(language, date_only, slug)
  name = "_posts/%s/%s-%s.markdown" % [language, date_only, slug]
  if File.exist?(name)
    raise name if yesno("#{name} already exists. Do you want to overwrite") == 'n'
  end
  name
end

happy = false

while not happy 
  date = Time.new.to_s[0..15]
  while true do
    date = enter "New date", date
    break if correct_date? date
    puts "Bad date"
  end
  date_only = date.to_s[0..9]

  title = enter "Title", ""
  slug = enter "Slug", ""
  language = ask("Language", ["r", "e"]) == "r" ? "russian" : "english"

  categories = enter_categories language

  quote = title.index('"') != nil ? "'" : '"'

  filename = make_filename(language, date_only, slug)

  printer = lambda { |stream, filename|
    puts "Creating file: %s" % filename
    stream.puts "---"
    stream.puts "layout: post"
    stream.puts "title: #{quote}#{title}#{quote}"
    stream.puts "language: #{language}"
    stream.puts "date: #{date}"
    stream.puts "comments: true"
    stream.puts "categories: "
    categories.sort.each { |k, v| stream.puts "- %s" % k }
    stream.puts "---"
  }

  printer.call(STDOUT,filename)

  happy = confirm("Happy")
end

write_file(filename, printer)

second_language = language == "russian" ? "english" : "russian"

if confirm("Create also post in %s" % second_language) then
  second_filename = make_filename(second_language, date_only, slug)
  categories.delete(language)
  categories[second_language] = true
  language = second_language
  printer.call(STDOUT, second_filename)
  write_file(second_filename, printer) if confirm("Happy")
end

edit_file(filename) if confirm("Edit [%s]" % filename)
edit_file(second_filename) if confirm("Edit [%s]" % second_filename)
