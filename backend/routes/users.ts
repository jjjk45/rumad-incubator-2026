import { Router, Request, Response } from 'express'
import supabase from '../lib/supabase'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

export default router
router.post('/', async (req: Request, res: Response) => {
  const { first_name, last_name, email, university } = req.body

  const { data, error } = await supabase
    .from('profiles')
    .insert([{ first_name, last_name, email, university }])
    .select()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})