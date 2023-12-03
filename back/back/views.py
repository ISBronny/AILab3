from django.http import JsonResponse
from django.views.decorators.http import require_GET
from transformers import GPT2Tokenizer, GPT2LMHeadModel


@require_GET
def generate_view(request):
    text = request.GET.get('text', '')

    def load_tokenizer_and_model(model_name_or_path):
        return GPT2Tokenizer.from_pretrained(model_name_or_path), GPT2LMHeadModel.from_pretrained(
            model_name_or_path).cuda()

    def generate(
            model, tok, text,
            do_sample=True, max_length=None, repetition_penalty=None,
            top_k=5, top_p=0.95, temperature=None,
            num_beams=3,
            no_repeat_ngram_size=3
    ):
        input_ids = tok.encode(text, return_tensors="pt").cuda()
        out = model.generate(
            input_ids.cuda(),
            max_length=max_length,
            repetition_penalty=repetition_penalty,
            do_sample=do_sample,
            top_k=top_k, top_p=top_p, temperature=temperature,
            num_beams=num_beams, no_repeat_ngram_size=no_repeat_ngram_size
        )
        return list(map(tok.decode, out))

    tok, model = load_tokenizer_and_model("sberbank-ai/rugpt3large_based_on_gpt2")

    gr1 = f'Для научной работа на тему: {text} можно написать следующую аннотацию: '
    generated = generate(model, tok, gr1, max_length=150)

    print(generated[0])

    gr2 =f'Для научной работа на тему: {text} можно написать следующий вывод: '

    generated2 = generate(model, tok, gr2, max_length=500)

    response_data = {
        'annotation': f'{generated[0][len(gr1):]}',
        'conclusion': f'{generated2[0][len(gr2):]}',
    }

    return JsonResponse(response_data, safe=False, json_dumps_params={'ensure_ascii': False})
