APPNAME = awards
PYTHON = python

ifeq ($(TOPSRCDIR),)
  export TOPSRCDIR = $(shell pwd)
endif
profile :=
ifneq ($(FIREFOX_PROFILE),)
  profile := --profiledir="$(FIREFOX_PROFILE)"
endif

deps  := $(TOPSRCDIR)/deps
ifneq ($(DEPSDIR),)
  deps := $(DEPSDIR)
endif

binary  := 
ifneq ($(MOZ_BINARY),)
  binary := -b "$(MOZ_BINARY)"
endif

addon_sdk := $(deps)/addon-sdk/bin

cfx_args :=  --pkgdir=$(TOPSRCDIR) $(binary) $(profile) --binary-args="-console -purgecaches"

test_args :=
ifneq ($(TEST),)
    test_args := -f $(TEST)
endif

# might be useful for symlink handling...
SLINK = ln -sf
ifneq ($(findstring MINGW,$(shell uname -s)),)
  SLINK = cp -r
  export NO_SYMLINK = 1
endif

all: xpi

xpi:    pull
	$(addon_sdk)/cfx xpi --no-strip-xpi $(cfx_args)

pull:
	$(PYTHON) build.py

test:
	$(addon_sdk)/cfx test $(cfx_args) $(test_args)

run:
	$(addon_sdk)/cfx run $(cfx_args)	

.PHONY: xpi clean pull test run
