function status(request, response) {
  response.status(200).json({ chave: "É acima da média" });
}

export default status;
