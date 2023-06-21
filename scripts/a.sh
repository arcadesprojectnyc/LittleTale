#!/bin/bash

OPENAI_API_KEY=`cat ~/.ssh/openai.key`
text="Once upon a time, there was a brave knight named Rex W. He rode his trusty horse, Sparky, through the fields of his kingdom. At the very beginning, Rex rided horse slowly. He want train his riding skill, so that he can ride faster and faster. After practicing for many days, Rex got better at riding. He felt brave enough to ride faster and faster. The name of the horse is Alex, they trained together every day. "

prompt="Continue the story with 2 simple sentences using language for age 7."

echo $OPENAI_API_KEY
echo "$text $prompt"

curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
     "model": "gpt-3.5-turbo",
     "messages": [{"role": "user", "content": "Once upon a time, there was a brave knight named Rex W. He rode his trusty horse, Sparky, through the fields of his kingdom. At the very beginning, Rex rided horse slowly. He want train his riding skill, so that he can ride faster and faster. After practicing for many days, Rex got better at riding. He felt brave enough to ride faster and faster. The name of the horse is Alex, they trained together every day. Continue the story with 2 simple sentences using language for age 7."}],
     "temperature": 0.7
   }'
