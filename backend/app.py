# backend/app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os, json, random, time
from werkzeug.utils import secure_filename
from PIL import Image, ImageChops

APP_ROOT = os.path.dirname(__file__)
DATA_DIR = os.path.join(APP_ROOT, "data")
UPLOADS = os.path.join(APP_ROOT, "uploads")
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOADS, exist_ok=True)

def path(fn): return os.path.join(DATA_DIR, fn)
def load(fn, default):
    p = path(fn)
    if not os.path.exists(p):
        with open(p, "w") as f: json.dump(default, f, indent=2)
    with open(p, "r") as f:
        try:
            return json.load(f)
        except:
            return default
def save(fn, data):
    with open(path(fn), "w") as f:
        json.dump(data, f, indent=2)

# Initialize files with sensible defaults
load("seller.json", {"name":"Demo Brand","shop":"demobrand","insta":"@demobrand","description":"A small demo store","color":"#0ea5a4","logo":""})
load("products.json", [
  {"id":1,"name":"Alpha Tee","price":499,"caption":"Comfy cotton tee","photo":"/uploads/alpha.jpg"},
  {"id":2,"name":"Beta Mug","price":299,"caption":"Ceramic mug","photo":"/uploads/beta.jpg"},
  {"id":3,"name":"Gamma Cap","price":399,"caption":"Stylish cap","photo":"/uploads/gamma.jpg"}
])
load("orders.json", [
  {"id":"ORD-10001","product":{"id":1,"name":"Alpha Tee"},"buyer":"A","address":"Mumbai","ts": time.time()-3600*24,"status":"Shipped","lat":19.0760,"lon":72.8777},
  {"id":"ORD-10002","product":{"id":1,"name":"Alpha Tee"},"buyer":"B","address":"Delhi","ts": time.time()-3600*48,"status":"In Progress","lat":28.7041,"lon":77.1025},
  {"id":"ORD-10003","product":{"id":2,"name":"Beta Mug"},"buyer":"C","address":"Bengaluru","ts": time.time()-3600*72,"status":"Packed","lat":12.9716,"lon":77.5946},
  {"id":"ORD-10004","product":{"id":3,"name":"Gamma Cap"},"buyer":"D","address":"Kolkata","ts": time.time()-3600*5,"status":"Delivered","lat":22.5726,"lon":88.3639},
  {"id":"ORD-10005","product":{"id":2,"name":"Beta Mug"},"buyer":"E","address":"Chennai","ts": time.time()-3600*10,"status":"Shipped","lat":13.0827,"lon":80.2707}
])
load("returns.json", [])

app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 25 * 1024 * 1024

# --- Utility ---
def gen_order_id():
    return f"ORD-{random.randint(10000,99999)}"

def save_upload(file_storage):
    filename = secure_filename(f"{int(time.time())}_{file_storage.filename}")
    fp = os.path.join(UPLOADS, filename)
    file_storage.save(fp)
    try:
        im = Image.open(fp)
        im.thumbnail((1000,1000))
        im.save(fp)
    except Exception:
        pass
    return "/uploads/" + filename

# --- Routes ---
@app.route("/uploads/<path:name>")
def uploaded(name):
    return send_from_directory(UPLOADS, name)

# Seller endpoints
@app.route("/api/seller", methods=["GET","POST"])
def api_seller():
    if request.method == "GET":
        return jsonify(load("seller.json", {}))
    data = request.json
    save("seller.json", data)
    return jsonify(data)

# Products endpoints
@app.route("/api/products", methods=["GET","POST","PUT","DELETE"])
def api_products():
    products = load("products.json", [])
    
    if request.method == "GET":
        return jsonify(products)

    elif request.method == "POST":
        if request.content_type and request.content_type.startswith("multipart/form-data"):
            name = request.form.get("name")
            price = float(request.form.get("price") or 0)
            caption = request.form.get("caption","")
            photo = save_upload(request.files["photo"]) if "photo" in request.files else ""
        else:
            body = request.json
            name = body.get("name")
            price = float(body.get("price",0))
            caption = body.get("caption","")
            photo = body.get("photo","")
        new = {"id": max((p["id"] for p in products), default=0)+1, "name":name, "price":price, "caption":caption, "photo":photo}
        products.append(new)
        save("products.json", products)
        return jsonify(new), 201

    elif request.method == "PUT":
        body = request.json
        for i,p in enumerate(products):
            if p["id"] == body["id"]:
                products[i].update(body)
                save("products.json", products)
                return jsonify(products[i])
        return jsonify({"error":"not found"}), 404

    elif request.method == "DELETE":
        pid = int(request.args.get("id"))
        products = [p for p in products if p["id"] != pid]
        save("products.json", products)
        return jsonify({"deleted": pid})

# Orders
@app.route("/api/orders", methods=["GET","POST"])
def api_orders():
    orders = load("orders.json", [])
    if request.method == "GET":
        return jsonify(orders)
    body = request.json
    oid = gen_order_id()
    order = {
        "id": oid,
        "product": body.get("product"),
        "buyer": body.get("buyer","Guest"),
        "address": body.get("address",""),
        "ts": time.time(),
        "status": "In Progress",
        "lat": body.get("lat", None),
        "lon": body.get("lon", None)
    }
    orders.append(order)
    save("orders.json", orders)
    return jsonify(order), 201

# Returns
@app.route("/api/returns", methods=["GET","POST","PUT"])
def api_returns():
    returns = load("returns.json", [])
    
    if request.method == "GET":
        return jsonify(returns)

    elif request.method == "POST":
        if request.content_type and request.content_type.startswith("multipart/form-data"):
            prod = request.form.get("product")
            order_id = request.form.get("orderId")
            reason = request.form.get("reason")
            files = [save_upload(f) for f in request.files.values()]
        else:
            body = request.json or {}
            prod = body.get("product")
            order_id = body.get("orderId")
            reason = body.get("reason")
            files = body.get("files", [])

        new = {
            "id": len(returns)+1,
            "product": prod,
            "orderId": order_id,
            "reason": reason,
            "files": files,
            "status": "pending",
            "ai": None,
            "created_at": time.time()
        }

        # --- AI Analysis (dummy/local) ---
        ai = {"approved": None, "score": None, "notes": ""}
        if not files:
            ai["notes"] = "No photos provided — manual review required."
        else:
            products_list = load("products.json", [])
            prod_obj = next((p for p in products_list if str(p.get("id"))==str(prod) or (p.get("name") and p["name"].lower()==str(prod).lower())), None)
            if prod_obj and prod_obj.get("photo") and files:
                try:
                    pfile = os.path.join(UPLOADS, prod_obj["photo"].split("/uploads/")[-1])
                    ufile = os.path.join(UPLOADS, files[0].split("/uploads/")[-1])
                    a = Image.open(pfile).convert("L").resize((200,200))
                    b = Image.open(ufile).convert("L").resize((200,200))
                    diff = ImageChops.difference(a,b)
                    mean_diff = sum(diff.getdata()) / (200*200*255)
                    similarity = round(1.0 - mean_diff, 2)
                    ai["score"] = similarity
                    ai["approved"] = similarity >= 0.5
                    ai["notes"] = f"Image similarity={similarity}. " + ("Approved" if ai["approved"] else "Manual review recommended")
                except Exception as e:
                    ai["notes"] = f"Error in AI analysis: {str(e)}"
        new["ai"] = ai
        returns.append(new)
        save("returns.json", returns)
        return jsonify(new), 201

    elif request.method == "PUT":
        body = request.json
        rid = int(body.get("id"))
        for r in returns:
            if r["id"] == rid:
                if "status" in body:
                    r["status"] = body["status"]
                if "admin_note" in body:
                    r["admin_note"] = body["admin_note"]
                save("returns.json", returns)
                return jsonify(r)
        return jsonify({"error":"not found"}), 404

# Validate-return demo
@app.route("/validate-return", methods=["POST"])
def validate_return():
    confidence = round(random.uniform(0.3,0.95),2)
    approved = confidence > 0.5
    return jsonify({"approved": approved, "confidence": confidence})

# Mock courier
@app.route("/mock-courier", methods=["POST"])
def mock_courier():
    tid = request.json.get("trackingId","")
    statuses = ["In Progress","Packed","Shipped","Out for delivery","Delivered"]
    idx = sum(ord(c) for c in tid) % len(statuses)
    return jsonify({"trackingId": tid, "status": statuses[idx]})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
