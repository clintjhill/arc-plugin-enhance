import path from 'path'
import plur from 'pluralize'

/** helper to get page element name */
//
// ... request path .......... filesystem path ..................... element name
// -----------------------------------------------------------------------------
// ... /foobar ............... pages/foobar.mjs .................... page-foobar
// ... /foo/bar/baz .......... pages/foo/bar/baz.mjs ............... page-foo-bar-baz
// ... /foo/bar .............. pages/foo/bar/index.mjs ............. page-foo-bar
// ... /people/13 ............ pages/users/$id.mjs ................. page-user
// ... /people/13/things ..... pages/users/$id/things.mjs .......... page-user-things ???
// ... /people/13/things/4 ... pages/users/$id/things/$thingID.mjs . page-user-thing ???
//
export default function getPageName (basePath, template) {
  // if we have a template we can derive the expected element name
  if (template) return fmt(basePath, template)
  // otherwise we are 404
  return false
}

/** serialize template name to element name */
function fmt (basePath, templatePath) {
  let base = path.join(basePath, 'pages')
  let raw = templatePath.replace(base, '').replace(/\.mjs/g, '').replace(path.sep, '').replace(new RegExp('\\' + path.sep, 'g'), '-')
  // if there are dynamic parts we need to do some additional formatting
  if (raw.includes('$')) {
    let parts = raw.split('-')
    let result = []
    let index = 0
    for (let p of parts) {
      // check if part is dynamic
      if (p.startsWith('$') === false) {
        // lookahead to the next part
        let next = parts[index + 1]
        if (next && next.startsWith('$')) {
          // singularize if it is dynamic
          result.push(plur.singular(p))
        }
        else {
          // otherwise concat and move on
          result.push(p)
        }
      }
      index += 1
    }
    return result.join('-')
  }
  return raw.replace('-index', '')
}
