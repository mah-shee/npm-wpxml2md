import assert from 'assert'
import Rewire from 'rewire'

/** @test {ImageLinkReplacer} */
describe('ImageLinkReplacer', () => {
  const Module = Rewire('./image-link-replacer.js')

  /** @test {parseImageLink} */
  describe('parseImageLink', () => {
    const parseImageLink = Module.__get__('parseImageLink')

    it('Parse', () => {
      const md =
`![title](http://example.com/sample.png)

The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.

[title](http://example.com/dummy/)

[![title](http://example.com/thumbnail.jpg)](http://example.com/sample.png "title")
`
      const actual = parseImageLink(md, 'base')
      const expected = {
        links: [
          '![title](http://example.com/sample.png)',
          '[![title](http://example.com/thumbnail.jpg)](http://example.com/sample.png "title")'
        ],
        images: [
          { url: 'http://example.com/sample.png', fileName: 'base-1.png' },
          { url: 'http://example.com/thumbnail.jpg', fileName: 'base-2.jpg' }
        ]
      }

      assert.deepStrictEqual(actual, expected)
    })
  })

  /** @test {replaceLinks} */
  describe('replaceLinks', () => {
    const replaceLinks = Module.__get__('replaceLinks')

    it('Replace links', () => {
      const links = [
        '![title](http://example.com/sample.png)',
        '[title](http://example.com/dummy.gif)',
        '[![title](http://example.com/sample.png)](http://example.com/sample.png "title")',
        '[![title](http://example.com/thumbnail.jpg)](http://example.com/sample.png "title")'
      ]

      const images = [
        { url: 'http://example.com/sample.png', fileName: '1.png' },
        { url: 'http://example.com/thumbnail.jpg', fileName: '2.jpg' }
      ]

      const actual = replaceLinks(links, images)

      // Other than `dummy.gif` should be replaced
      const expected = [
        { link: links[0], newLink: '![title](1.png)' },
        { link: links[2], newLink: '[![title](1.png)](1.png "title")' },
        { link: links[3], newLink: '[![title](2.jpg)](1.png "title")' }
      ]

      assert.deepStrictEqual(actual, expected)
    })
  })
})
