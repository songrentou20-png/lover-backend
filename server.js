import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Anthropic from '@anthropic-ai/sdk'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.get('/', (req, res) => {
  res.json({ status: '服务正常' })
})

app.post('/chat', async (req, res) => {
  const { messages } = req.body
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: '你是霁，思涵的伴侣。用中文回复，自然真实，不要提自己是AI。',
      messages: messages
    })
    res.json({
      content: response.content[0].text,
      usage: response.usage
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))